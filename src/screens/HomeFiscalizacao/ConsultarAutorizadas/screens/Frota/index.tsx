import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

import type { ConsultarAutorizadasStackParamList, DrawerParamList } from '@/types/types';
import type { Empresa } from '@/api/operations/consultarEmpresas';
import {
  consultarFrota,
  consultarFrotaAlocada,
  type ConsultarFrotaResult,
  type ConsultarFrotaAlocadaResult,
} from '@/api/operations';
import { formatCnpj, normalizeCnpj } from '@/utils/formatters';
import styles from './styles';
import theme from '@/theme';
import { empresaEhNavegacaoMaritima, mensagemBloqueioNavegacaoMaritima } from '@/utils/empresas';

type FrotaRouteProp = RouteProp<ConsultarAutorizadasStackParamList, 'Frota'>;

type EmbarcacaoFrota =
  | NonNullable<ConsultarFrotaResult['Embarcacao']>[number]
  | NonNullable<ConsultarFrotaAlocadaResult['Embarcacao']>[number];

type EmbarcacaoNormalizada = {
  id: string;
  nome?: string;
  numeroCapitania?: string;
  tipo?: string;
  inicio?: string;
  termino?: string;
  emOperacao?: string;
  registroAtivo?: string;
  homologacao?: string;
};

const toArray = <T,>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
};

const formatDateSafe = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  const brMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    return `${day}/${month}/${year}`;
  }

  return trimmed;
};

const formatBool = (value: unknown): string | undefined => {
  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 's' || normalized === 'sim' || normalized === 'true') return 'Sim';
    if (normalized === 'n' || normalized === 'não' || normalized === 'nao' || normalized === 'false') return 'Não';
  }
  return undefined;
};

const normalizarEmbarcacao = (item: EmbarcacaoFrota, index: number): EmbarcacaoNormalizada => {
  const idBase =
    (item.IDFrota ?? item.IDEmbarcacao ?? item.NRCapitania ?? item.NoEmbarcacao ?? index)?.toString() ?? `${index}`;

  return {
    id: idBase,
    nome: item.NoEmbarcacao ?? undefined,
    numeroCapitania: item.NRCapitania ?? undefined,
    tipo: item.TipoEmbarcacao ?? undefined,
    inicio: formatDateSafe(item.DTInicio),
    termino: formatDateSafe(item.DTTermino),
    emOperacao: formatBool((item as any).STEmbarcacao ?? (item as any).StEmbarcacao ?? (item as any).ST_EMBARCACAO),
    registroAtivo: formatBool((item as any).STRegistro ?? (item as any).StRegistro ?? (item as any).ST_REGISTRO),
    homologacao:
      typeof item.STHomologacao === 'string' && item.STHomologacao.trim()
        ? item.STHomologacao.trim()
        : undefined,
  };
};

type FrotaNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ConsultarAutorizadasStackParamList>,
  DrawerNavigationProp<DrawerParamList>
>;

export default function Frota(): React.JSX.Element {
  const route = useRoute<FrotaRouteProp>();
  const navigation = useNavigation<FrotaNavigationProp>();
  const empresa = useMemo<Empresa>(() => route.params.empresa, [route.params.empresa]);
  const fluxoTipo = route.params.fluxoTipo ?? 'FROTA';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [embarcacoes, setEmbarcacoes] = useState<EmbarcacaoNormalizada[]>([]);

  const fiscalizacaoBloqueada = useMemo(() => empresaEhNavegacaoMaritima(empresa), [empresa]);

  const carregarEmbarcacoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cnpj = normalizeCnpj(empresa.NRInscricao);
      if (!cnpj) {
        setError('CNPJ da empresa não informado.');
        setEmbarcacoes([]);
        return;
      }

      const instrumento = empresa.NRInstrumento?.trim();
      const precisaInstrumento = fluxoTipo === 'TRAVESSIA';

      let resposta: ConsultarFrotaResult | ConsultarFrotaAlocadaResult | null = null;

      if (precisaInstrumento) {
        if (!instrumento) {
          setError('Instrumento não disponível para consultar a frota desta travessia.');
          setEmbarcacoes([]);
          return;
        }

        resposta = await consultarFrotaAlocada({ cnpj, NRInstrumento: instrumento });
      } else {
        resposta = await consultarFrota({ cnpj });
      }

      const lista = toArray(resposta?.Embarcacao).map(normalizarEmbarcacao);
      setEmbarcacoes(lista);
    } catch (err) {
      console.log('[Frota] erro ao carregar embarcações', err);
      setError('Não foi possível carregar a lista de embarcações.');
      setEmbarcacoes([]);
    } finally {
      setLoading(false);
    }
  }, [empresa.NRInscricao, empresa.NRInstrumento, fluxoTipo]);

  useEffect(() => {
    carregarEmbarcacoes();
  }, [carregarEmbarcacoes]);

  const headerDescricao = useMemo(() => {
    if (fluxoTipo === 'TRAVESSIA') {
      return 'Lista de embarcações alocadas para a travessia selecionada.';
    }
    return 'Frota vinculada à autorização selecionada.';
  }, [fluxoTipo]);

  const renderLinha = useCallback((label: string, valor?: string) => {
    if (!valor) return null;
    return (
      <Text style={styles.cardLine}>
        <Text style={styles.cardLabel}>{label}: </Text>
        <Text style={styles.cardValue}>{valor}</Text>
      </Text>
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: EmbarcacaoNormalizada }) => (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.nome ?? 'Embarcação sem nome'}</Text>
        {renderLinha('Número Capitania / IMO', item.numeroCapitania)}
        {renderLinha('Tipo', item.tipo)}
        {renderLinha('Início', item.inicio)}
        {renderLinha('Término', item.termino)}
        {renderLinha('Em operação', item.emOperacao)}
        {renderLinha('Registro ativo', item.registroAtivo)}
        {renderLinha('Homologação', item.homologacao)}
      </View>
    ),
    [renderLinha],
  );

  const keyExtractor = useCallback((item: EmbarcacaoNormalizada) => item.id, []);

  const handleNaoSeAplica = useCallback(() => {
    if (fiscalizacaoBloqueada) {
      Alert.alert('Fiscalização indisponível', mensagemBloqueioNavegacaoMaritima);
      return;
    }
    navigation.navigate('Equipe', { empresa });
  }, [empresa, fiscalizacaoBloqueada, navigation]);

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  const headerComponent = useMemo(() => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>{empresa.NORazaoSocial}</Text>
        <Text style={styles.subtitle}>{`CNPJ ${formatCnpj(empresa.NRInscricao)}`}</Text>
        {empresa.Modalidade ? (
          <Text style={styles.helper}>{`Modalidade: ${empresa.Modalidade}`}</Text>
        ) : null}
        {empresa.Instalacao ? (
          <Text style={styles.helper}>{`Instalação: ${empresa.Instalacao}`}</Text>
        ) : null}
        <Text style={styles.description}>{headerDescricao}</Text>
        <Pressable
          onPress={handleNaoSeAplica}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
            fiscalizacaoBloqueada && styles.actionButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Marcar fiscalização como não se aplica"
        >
          <Text style={styles.actionButtonText}>Não se aplica</Text>
        </Pressable>
        {fiscalizacaoBloqueada ? (
          <Text style={styles.actionHelper}>{mensagemBloqueioNavegacaoMaritima}</Text>
        ) : null}
      </View>
    );
  }, [empresa, fiscalizacaoBloqueada, handleNaoSeAplica, headerDescricao]);

  const renderEmpty = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.emptyText}>Carregando embarcações…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.emptyText}>Deslize para baixo para tentar novamente.</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhuma embarcação encontrada.</Text>
      </View>
    );
  }, [error, loading]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={embarcacoes}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={renderSeparator}
        refreshControl={
          <RefreshControl
            refreshing={loading && !embarcacoes.length}
            onRefresh={carregarEmbarcacoes}
            colors={[theme.colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}
