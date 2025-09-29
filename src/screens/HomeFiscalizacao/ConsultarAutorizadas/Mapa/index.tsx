import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { WebView } from 'react-native-webview';

import theme from '@/theme';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';
import type { Empresa } from '@/api/consultarEmpresas';
import {
  consultarInstalacoesPortuarias,
  type InstalacaoPortuaria,
} from '@/api/consultarInstalacoesPortuarias';
import {
  carregarInstalacoesCache,
  salvarInstalacoesCache,
  type InstalacoesCache,
} from '@/services/instalacoesCache';
import { parseCoordenada } from '@/utils/geo';
import {
  atualizarMapaSnapshot,
  carregarMapaSnapshot,
  snapshotEhAntigo,
  type MapSnapshot,
} from '@/services/mapSnapshotCache';

type MapaRouteProp = RouteProp<ConsultarAutorizadasStackParamList, 'Mapa'>;

type DataSource = 'online' | 'cache' | 'cache-stale' | 'empty';

type TerminalInfo = {
  terminal: InstalacaoPortuaria;
  lat: number;
  lng: number;
};

type PreferenciasInstalacao = {
  instalacao?: string;
  razaoSocialInstalacao?: string;
  razaoSocialEmpresa?: string;
  inscricaoInstalacao?: string;
  inscricaoEmpresa?: string;
};

const GOOGLE_MAPS_URL =
  'https://maps.googleapis.com/maps/api/js?v=3.53&key=AIzaSyBByE0Uc7WXYndpyTk_3he-TqgSQ4Pyhbw&callback=initMap';

const GOOGLE_STATIC_DEFAULT_ZOOM = 13;

const collapseSpaces = (value: string) => value.replace(/\s+/g, ' ').trim();

const removeDiacritics = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const normalizeTexto = (value?: string) => {
  if (!value) return '';
  return removeDiacritics(collapseSpaces(value)).toLowerCase();
};

const normalizeCodigo = (value?: string) => {
  if (!value) return '';
  return removeDiacritics(value).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

const temCoordenadasValidas = (instalacao: InstalacaoPortuaria): boolean =>
  parseCoordenada(instalacao.latitude) != null && parseCoordenada(instalacao.longitude) != null;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function pickTerminal(
  lista: InstalacaoPortuaria[],
  preferencia: PreferenciasInstalacao,
): number {
  if (!lista.length) return -1;
  const candidatosPreferidos = [
    normalizeTexto(preferencia.instalacao),
    normalizeTexto(preferencia.razaoSocialInstalacao),
    normalizeTexto(preferencia.razaoSocialEmpresa),
  ].filter(Boolean);

  const codigosPreferidos = [
    normalizeCodigo(preferencia.inscricaoInstalacao),
    normalizeCodigo(preferencia.inscricaoEmpresa),
  ].filter(Boolean);

  const buscarIndice = (criterio: (item: InstalacaoPortuaria) => boolean) =>
    lista.findIndex((item) => criterio(item));

  const tentaPorPreferencia = (exigirCoordenadas: boolean) =>
    buscarIndice((item) => {
      if (exigirCoordenadas && !temCoordenadasValidas(item)) {
        return false;
      }
      const nome = normalizeTexto(item.nome);
      const local = normalizeTexto(item.localizacao);
      const codigo = normalizeCodigo(item.cdInstalacaoPortuaria) || normalizeCodigo(item.cdTerminal);

      return (
        candidatosPreferidos.some((alvo) => alvo === nome || alvo === local) ||
        (codigo && codigosPreferidos.some((alvo) => alvo === codigo))
      );
    });

  const indicePreferidoComCoordenadas = tentaPorPreferencia(true);
  if (indicePreferidoComCoordenadas >= 0) return indicePreferidoComCoordenadas;

  const indicePreferido = tentaPorPreferencia(false);
  if (indicePreferido >= 0) return indicePreferido;

  const primeiroComCoordenadas = buscarIndice((item) => temCoordenadasValidas(item));
  if (primeiroComCoordenadas >= 0) return primeiroComCoordenadas;

  return 0;
}

function formatEndereco(instalacao: InstalacaoPortuaria): string {
  const partes = [instalacao.endereco, instalacao.numero]
    .map((parte) => (parte ?? '').trim())
    .filter(Boolean);
  const linha1 = partes.join(', ');
  const linha2 = [instalacao.cidade, instalacao.estado].map((parte) => (parte ?? '').trim()).filter(Boolean).join(' - ');
  const extras = [instalacao.pais, instalacao.cep].map((parte) => (parte ?? '').trim()).filter(Boolean).join(' • ');
  return [linha1, linha2, extras].filter(Boolean).join('\n');
}

function construirInfoHtml(instalacao: InstalacaoPortuaria, empresa: Empresa): string {
  const linhas: string[] = [];
  if (instalacao.situacao) linhas.push(`Situação: ${instalacao.situacao}`);
  if (instalacao.modalidade) linhas.push(`Modalidade: ${instalacao.modalidade}`);
  if (instalacao.regiaoHidrografica) linhas.push(`Região hidrográfica: ${instalacao.regiaoHidrografica}`);
  if (empresa.Modalidade && !instalacao.modalidade) linhas.push(`Modalidade da autorização: ${empresa.Modalidade}`);
  const endereco = formatEndereco(instalacao);
  if (endereco) linhas.push(endereco.replace(/\n/g, ' • '));

  const titulo = instalacao.nome || instalacao.localizacao || empresa.Instalacao || 'Instalação portuária';

  return `
    <div style="font-size:14px;color:#1b1b1b;max-width:240px">
      <strong>${escapeHtml(titulo)}</strong>
      <div>${linhas.map((linha) => `<div>${escapeHtml(linha)}</div>`).join('')}</div>
    </div>
  `;
}

function construirHtmlMapa(info: TerminalInfo, empresa: Empresa): string {
  const titulo = info.terminal.nome || info.terminal.localizacao || empresa.Instalacao || 'Instalação';
  const infoHtml = construirInfoHtml(info.terminal, empresa);
  const onlineScript = `<script src="${GOOGLE_MAPS_URL}" async defer></script>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <style>
      html, body { height: 100%; margin: 0; padding: 0; }
      #map { height: 100%; width: 100%; }
    </style>
    <script type="text/javascript">
      function initMap() {
        if (!window.google || !window.google.maps) {
          return;
        }
        var center = { lat: ${info.lat}, lng: ${info.lng} };
        var map = new google.maps.Map(document.getElementById('map'), {
          center: center,
          zoom: 13,
          mapTypeId: 'roadmap',
          gestureHandling: 'greedy'
        });
        var infoWindow = new google.maps.InfoWindow({ content: ${JSON.stringify(infoHtml)} });
        var marker = new google.maps.Marker({
          position: center,
          map: map,
          title: ${JSON.stringify(titulo)}
        });
        marker.addListener('click', function () {
          infoWindow.open(map, marker);
        });
        infoWindow.open(map, marker);
      }
    </script>
    ${onlineScript}
  </head>
  <body>
    <div id="map"></div>
  </body>
</html>`;
}

export default function MapaInstalacao(): React.JSX.Element {
  const route = useRoute<MapaRouteProp>();
  const empresa = route.params.empresa;
  const {
    Instalacao,
    Modalidade,
    NRInscricao,
    NORazaoSocial,
    NORazaoSocialInstalacao,
    NRInscricaoInstalacao,
  } = empresa;

  const [instalacoes, setInstalacoes] = useState<InstalacaoPortuaria[]>([]);
  const [selecionada, setSelecionada] = useState<number>(-1);
  const [carregando, setCarregando] = useState(true);
  const [fonteDados, setFonteDados] = useState<DataSource>('online');
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<InstalacoesCache | null>(null);
  const [online, setOnline] = useState(false);
  const [snapshot, setSnapshot] = useState<MapSnapshot | null>(null);
  const [carregandoSnapshot, setCarregandoSnapshot] = useState(false);
  const [erroSnapshot, setErroSnapshot] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setMensagem(null);
      try {
        const estadoRede = await NetInfo.fetch();
        const conectado = Boolean(estadoRede.isConnected && estadoRede.isInternetReachable !== false);

        let lista: InstalacaoPortuaria[] = [];
        let cacheAtual = await carregarInstalacoesCache(NRInscricao);
        let origem: DataSource = 'online';

        if (conectado) {
          try {
            lista = await consultarInstalacoesPortuarias({
              cnpj: NRInscricao,
              instalacao: Instalacao,
              modalidade: Modalidade,
            });
            if (lista.length > 0) {
              await salvarInstalacoesCache(NRInscricao, lista);
              cacheAtual = await carregarInstalacoesCache(NRInscricao);
              origem = 'online';
            }
          } catch (err) {
            const mensagemErro = err instanceof Error ? err.message : 'Erro desconhecido ao consultar instalações.';
            setMensagem(`Não foi possível atualizar o mapa (${mensagemErro}). Será exibida a última versão salva.`);
          }
        }

        if (!lista.length && cacheAtual?.instalacoes?.length) {
          lista = cacheAtual.instalacoes;
          origem = cacheAtual.stale ? 'cache-stale' : 'cache';
        }

        if (!lista.length) {
          origem = 'empty';
          setMensagem('Nenhuma instalação com coordenadas foi encontrada para esta empresa.');
        }

        if (!ativo) return;

        setOnline(conectado);
        setInstalacoes(lista);
        setFonteDados(origem);
        setCacheInfo(cacheAtual ?? null);
        const indice = pickTerminal(lista, {
          instalacao: Instalacao,
          razaoSocialInstalacao: NORazaoSocialInstalacao,
          razaoSocialEmpresa: NORazaoSocial,
          inscricaoInstalacao: NRInscricaoInstalacao,
          inscricaoEmpresa: NRInscricao,
        });
        setSelecionada(indice);
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [
    Instalacao,
    Modalidade,
    NRInscricao,
    NORazaoSocial,
    NORazaoSocialInstalacao,
    NRInscricaoInstalacao,
  ]);

  const terminalSelecionado = useMemo<InstalacaoPortuaria | null>(() => {
    if (selecionada < 0) return null;
    return instalacoes[selecionada] ?? null;
  }, [instalacoes, selecionada]);

  const infoTerminal = useMemo<TerminalInfo | null>(() => {
    if (!terminalSelecionado) return null;
    const latitude = parseCoordenada(terminalSelecionado.latitude);
    const longitude = parseCoordenada(terminalSelecionado.longitude);
    if (latitude == null || longitude == null) return null;
    return { terminal: terminalSelecionado, lat: latitude, lng: longitude };
  }, [terminalSelecionado]);

  const htmlMapa = useMemo(() => {
    if (!infoTerminal) return null;
    return construirHtmlMapa(infoTerminal, empresa);
  }, [empresa, infoTerminal]);

  const mapsApiKey = useMemo(() => {
    const match = GOOGLE_MAPS_URL.match(/[?&]key=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }, []);

  useEffect(() => {
    let ativo = true;
    async function carregarSnapshotLocal() {
      if (!infoTerminal) {
        if (ativo) setSnapshot(null);
        return;
      }
      const existente = await carregarMapaSnapshot({
        cnpj: NRInscricao,
        lat: infoTerminal.lat,
        lng: infoTerminal.lng,
        zoom: GOOGLE_STATIC_DEFAULT_ZOOM,
      });
      if (ativo) {
        setSnapshot(existente);
      }
    }
    carregarSnapshotLocal();
    return () => {
      ativo = false;
    };
  }, [NRInscricao, infoTerminal]);

  useEffect(() => {
    let cancelado = false;
    async function atualizarSnapshot() {
      if (!infoTerminal || !mapsApiKey || !online) {
        if (!cancelado) {
          setCarregandoSnapshot(false);
        }
        return;
      }
      setCarregandoSnapshot(true);
      setErroSnapshot(null);
      try {
        const atualizado = await atualizarMapaSnapshot({
          apiKey: mapsApiKey,
          cnpj: NRInscricao,
          lat: infoTerminal.lat,
          lng: infoTerminal.lng,
          zoom: GOOGLE_STATIC_DEFAULT_ZOOM,
        });
        if (!cancelado) {
          setSnapshot(atualizado);
        }
      } catch (err) {
        if (!cancelado) {
          const mensagemErro =
            err instanceof Error ? err.message : 'Não foi possível atualizar o mapa offline.';
          setErroSnapshot(mensagemErro);
        }
      } finally {
        if (!cancelado) {
          setCarregandoSnapshot(false);
        }
      }
    }
    atualizarSnapshot();
    return () => {
      cancelado = true;
    };
  }, [NRInscricao, infoTerminal, mapsApiKey, online]);

  const handleSelecionar = useCallback(
    (index: number) => {
      setSelecionada(index);
    },
    [],
  );

  const descricaoFonte = useMemo(() => {
    switch (fonteDados) {
      case 'online':
        return 'Dados atualizados da API';
      case 'cache':
        return 'Dados carregados do modo offline';
      case 'cache-stale':
        return 'Dados offline desatualizados (sincronize quando possível)';
      default:
        return 'Sem dados disponíveis';
    }
  }, [fonteDados]);

  const atualizadoEm = useMemo(() => {
    if (!cacheInfo?.updatedAt) return null;
    const date = new Date(cacheInfo.updatedAt);
    return date.toLocaleString('pt-BR');
  }, [cacheInfo]);

  const snapshotAtualizadoEm = useMemo(() => {
    if (!snapshot?.createdAt) return null;
    return new Date(snapshot.createdAt).toLocaleString('pt-BR');
  }, [snapshot]);

  const snapshotDesatualizado = useMemo(() => snapshotEhAntigo(snapshot), [snapshot]);

  const mostrarMapaOnline = Boolean(htmlMapa && online && !carregando);

  const snapshotAspectRatio = snapshot ? snapshot.width / snapshot.height : 1.5;

  const renderItem = useCallback(
    ({ item, index }: { item: InstalacaoPortuaria; index: number }) => {
      const ativo = index === selecionada;
      const titulo = item.nome || item.localizacao || `Instalação ${index + 1}`;
      const descricao = formatEndereco(item);
      const possuiCoordenadas = temCoordenadasValidas(item);
      return (
        <Pressable
          onPress={() => handleSelecionar(index)}
          style={({ pressed }) => [
            styles.instalacaoItem,
            ativo && styles.instalacaoItemAtivo,
            pressed && styles.instalacaoItemPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Selecionar instalação ${titulo}`}
        >
          <Text style={[styles.instalacaoTitulo, ativo && styles.instalacaoTituloAtivo]}>{titulo}</Text>
          {descricao ? <Text style={styles.instalacaoDescricao}>{descricao}</Text> : null}
          {!possuiCoordenadas ? (
            <Text style={styles.instalacaoAviso}>Coordenadas não informadas</Text>
          ) : null}
        </Pressable>
      );
    },
    [handleSelecionar, selecionada],
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.empresaTitulo}>{NORazaoSocial}</Text>
        {Modalidade ? <Text style={styles.empresaSubtitulo}>{Modalidade}</Text> : null}
        <Text style={styles.fonte}>
          {descricaoFonte}
          {atualizadoEm ? ` • Atualizado em ${atualizadoEm}` : ''}
          {!mostrarMapaOnline && snapshotAtualizadoEm
            ? ` • Mapa offline gerado em ${snapshotAtualizadoEm}`
            : ''}
        </Text>
      </View>

      {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
      {erroSnapshot ? <Text style={styles.mensagem}>{erroSnapshot}</Text> : null}
      {snapshot && snapshotDesatualizado ? (
        <Text style={styles.mensagem}>
          O mapa offline foi gerado há mais de 7 dias. Conecte-se para obter uma imagem atualizada.
        </Text>
      ) : null}

      {carregando ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : null}

      {!carregando && instalacoes.length > 1 ? (
        <View style={styles.listaWrapper}>
          <Text style={styles.listaTitulo}>Instalações disponíveis</Text>
          <FlatList
            data={instalacoes}
            keyExtractor={(item, index) => `${item.cdInstalacaoPortuaria || item.nome || index}`}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listaContainer}
          />
        </View>
      ) : null}

      <View style={styles.mapaWrapper}>
        {mostrarMapaOnline ? (
          <WebView originWhitelist={['*']} source={{ html: htmlMapa ?? '' }} style={styles.webview} />
        ) : null}
        {!carregando && !mostrarMapaOnline && snapshot ? (
          <View style={styles.snapshotWrapper}>
            <Image
              source={{ uri: `data:image/png;base64,${snapshot.base64}` }}
              style={[styles.snapshotImage, { aspectRatio: snapshotAspectRatio }]}
              resizeMode="cover"
            />
            {snapshotAtualizadoEm ? (
              <Text style={styles.snapshotLegenda}>Mapa offline disponível desde {snapshotAtualizadoEm}.</Text>
            ) : null}
          </View>
        ) : null}
        {!carregando && !mostrarMapaOnline && !snapshot ? (
          <View style={styles.semCoordenadas}>
            <Text style={styles.semCoordenadasTitulo}>Coordenadas indisponíveis</Text>
            <Text style={styles.semCoordenadasDescricao}>
              Não foi possível interpretar latitude e longitude para a instalação selecionada.
            </Text>
          </View>
        ) : null}
        {carregandoSnapshot ? (
          <View style={styles.snapshotLoader}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.snapshotLoaderTexto}>Atualizando cópia offline do mapa…</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  header: { padding: theme.spacing.md, gap: 4 },
  empresaTitulo: { ...theme.typography.heading },
  empresaSubtitulo: { ...theme.typography.body, color: theme.colors.muted },
  fonte: { ...theme.typography.caption, color: theme.colors.muted },
  mensagem: { ...theme.typography.caption, color: theme.colors.warning, paddingHorizontal: theme.spacing.md },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listaWrapper: { paddingVertical: theme.spacing.sm },
  listaTitulo: { ...theme.typography.body, paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.xs },
  listaContainer: { paddingHorizontal: theme.spacing.md, gap: theme.spacing.sm },
  instalacaoItem: {
    width: 260,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.background,
    backgroundColor: theme.colors.background,
  },
  instalacaoItemAtivo: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  instalacaoItemPressed: { opacity: 0.85 },
  instalacaoTitulo: { ...theme.typography.body, fontWeight: '600', color: theme.colors.text },
  instalacaoTituloAtivo: { color: theme.colors.primaryDark },
  instalacaoDescricao: { ...theme.typography.caption, color: theme.colors.muted, marginTop: theme.spacing.xs },
  instalacaoAviso: {
    ...theme.typography.caption,
    color: theme.colors.warning,
    marginTop: theme.spacing.xs,
  },
  mapaWrapper: {
    flex: 1,
    margin: theme.spacing.md,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },
  webview: { flex: 1 },
  snapshotWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  snapshotImage: {
    width: '100%',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
  },
  snapshotLegenda: { ...theme.typography.caption, color: theme.colors.muted, textAlign: 'center' },
  semCoordenadas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  semCoordenadasTitulo: { ...theme.typography.heading, fontSize: 18 },
  semCoordenadasDescricao: { ...theme.typography.body, color: theme.colors.muted, textAlign: 'center' },
  snapshotLoader: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    left: theme.spacing.sm,
    right: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  snapshotLoaderTexto: { ...theme.typography.caption, color: theme.colors.muted },
});

