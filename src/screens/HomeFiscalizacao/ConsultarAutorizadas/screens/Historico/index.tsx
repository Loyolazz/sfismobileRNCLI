import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import theme from '@/theme';
import { formatCnpj, formatDate } from '@/utils/formatters';
import {
  consultarHistoricoFiscalizacoesPorEmpresa,
  type HistoricoAcaoFiscalizadora,
  type HistoricoProcessoEmpresa,
} from '@/api/operations/consultarHistoricoFiscalizacoesPorEmpresa';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';
import styles from './styles';

type HistoricoRouteProp = RouteProp<ConsultarAutorizadasStackParamList, 'Historico'>;

type ProcessoHistorico = HistoricoProcessoEmpresa;

type AcaoHistorico = HistoricoAcaoFiscalizadora;

type ProcessosAgrupados = {
  emAndamento: ProcessoHistorico[];
  julgados: ProcessoHistorico[];
  autos: ProcessoHistorico[];
  notificacoes: ProcessoHistorico[];
};

const normalizarTipoHistorico = (valor: ProcessoHistorico['TPHistorico']): string => {
  if (valor === null || valor === undefined) return '';
  return typeof valor === 'string' ? valor.trim() : '';
};

function agruparProcessos(processos: ProcessoHistorico[]): ProcessosAgrupados {
  return processos.reduce<ProcessosAgrupados>(
    (acc, item) => {
      const tipo = normalizarTipoHistorico(item?.TPHistorico);
      switch (tipo) {
        case '1':
          acc.emAndamento.push(item);
          break;
        case '2':
          acc.julgados.push(item);
          break;
        case '3':
          acc.autos.push(item);
          break;
        case '4':
          acc.notificacoes.push(item);
          break;
        default:
          break;
      }
      return acc;
    },
    { emAndamento: [], julgados: [], autos: [], notificacoes: [] },
  );
}

const formatBool = (value?: boolean | string): string => {
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (value === 'true') return 'Sim';
  if (value === 'false') return 'Não';
  return value ?? '';
};

const formatCurrency = (value?: string): string => {
  if (!value) return '';
  const normalized = value.replace(/[^0-9,-]/g, '').replace(',', '.');
  const amount = Number(normalized);
  if (Number.isNaN(amount)) return value;
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const normalizarTexto = (valor?: string | number | null): string => {
  if (valor === null || valor === undefined) return '';
  if (typeof valor === 'string') return valor.trim();
  if (typeof valor === 'number') return String(valor);
  return '';
};

const getProcessoNumero = (item: ProcessoHistorico): string =>
  normalizarTexto(item?.CodProcessoFormatado) ||
  normalizarTexto(item?.CodProcesso) ||
  '—';

const linha = (
  label: string,
  valor?: string | number | null,
): React.JSX.Element | null => {
  const texto = normalizarTexto(valor);
  if (!texto) return null;
  return (
    <Text style={styles.infoText}>
      {label}: <Text style={styles.infoValue}>{texto}</Text>
    </Text>
  );
};

export default function Historico(): React.JSX.Element {
  const route = useRoute<HistoricoRouteProp>();
  const { empresa } = route.params;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [processos, setProcessos] = useState<ProcessoHistorico[]>([]);
  const [acoes, setAcoes] = useState<AcaoHistorico[]>([]);

  const carregarHistorico = useCallback(async () => {
    setErro(null);
    try {
      const response = await consultarHistoricoFiscalizacoesPorEmpresa({
        nrinscricao: empresa.NRInscricao,
      });
      console.log('[Historico] resposta da API normalizada', {
        processos: response.processos,
        acoes: response.acoes,
      });
      console.log('[Historico] payload bruto retornado pela API', response.raw);
      setProcessos(response.processos);
      setAcoes(response.acoes);
    } catch (error) {
      console.log('[Historico] erro ao consultar histórico', error);
      setErro('Não foi possível carregar o histórico de fiscalizações.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [empresa.NRInscricao]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  const agrupados = useMemo(() => agruparProcessos(processos), [processos]);

  const temDados = useMemo(
    () =>
      agrupados.emAndamento.length +
        agrupados.julgados.length +
        agrupados.autos.length +
        agrupados.notificacoes.length +
        acoes.length >
      0,
    [agrupados, acoes.length],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarHistorico();
  }, [carregarHistorico]);

  const renderProcessoCard = useCallback(
    (
      item: ProcessoHistorico,
      extras: Array<[string, string | number | null | undefined]>,
      index: number,
    ) => {
      const key = [
        item.TPHistorico,
        item.CodProcesso,
        item.NRAutoInfracao,
        item.NRNotificacao,
        index,
      ]
        .map((parte) => (parte == null ? '' : String(parte)))
        .join('|');

      return (
        <View key={key} style={styles.card}>
          {linha('Nº do processo', getProcessoNumero(item))}
          {linha('Tipo de fiscalização', item.TipoFiscalizacao)}
          {linha('Situação', item.SituacaoProcesso)}
          {extras.map(([label, valor], extraIndex) => {
            const conteudo = linha(label, valor);
            if (!conteudo) return null;
            return <React.Fragment key={`${label}-${extraIndex}`}>{conteudo}</React.Fragment>;
          })}
        </View>
      );
    },
    [],
  );

  const renderSecaoProcessos = useCallback(
    (
      titulo: string,
      itens: ProcessoHistorico[],
      extrasMapper: (
        item: ProcessoHistorico,
      ) => Array<[string, string | number | null | undefined]>,
    ) => {
      if (itens.length === 0) return null;
      return (
        <View style={styles.section} key={titulo}>
          <Text style={styles.sectionTitle}>{titulo}</Text>
          {itens.map((item, index) => renderProcessoCard(item, extrasMapper(item), index))}
        </View>
      );
    },
    [renderProcessoCard],
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{empresa.NORazaoSocial}</Text>
          <Text style={styles.subtitle}>CNPJ {formatCnpj(empresa.NRInscricao)}</Text>
          {empresa.Modalidade ? <Text style={styles.subtitle}>{empresa.Modalidade}</Text> : null}
        </View>

        {erro ? <Text style={styles.error}>{erro}</Text> : null}

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : null}

        {!loading && !erro ? (
          temDados ? (
            <>
              {renderSecaoProcessos('Processos em andamento', agrupados.emAndamento, (item) => [
                ['Nº do auto de infração', item.NRAutoInfracao],
                ['Código de irregularidade', item.DSIrregularidadeIE],
                ['Tipo de infração', item.TipoInfracao],
              ])}

              {renderSecaoProcessos('Sancionadores julgados', agrupados.julgados, (item) => [
                ['Código de irregularidade', item.DSIrregularidadeIE],
                ['Nº do auto de infração', item.NRAutoInfracao],
                ['Tipo de decisão', item.TipoDecisao],
                ['Valor da multa', formatCurrency(item.VLMulta)],
              ])}

              {renderSecaoProcessos('Autos de infração', agrupados.autos, (item) => [
                ['Nº do auto de infração', item.NRAutoInfracao],
                ['Data de ciência', formatDate(item.DTCiencia)],
                ['Código de irregularidade', item.DSIrregularidadeIE],
                ['Tipo de infração', item.TipoInfracao],
                ['Situação do processo', item.SituacaoProcesso],
              ])}

              {renderSecaoProcessos('Notificações (NOCI)', agrupados.notificacoes, (item) => [
                ['Nº da notificação', item.NRNotificacao],
                ['Data de ciência', formatDate(item.DTCiencia)],
                ['Código de irregularidade', item.DSIrregularidadeIE],
                ['Tipo de infração', item.TipoInfracao],
                ['Nº do processo', getProcessoNumero(item)],
                ['Sanada', formatBool(item.STCorrigida)],
              ])}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ações fiscalizadoras</Text>
                {acoes.length === 0 ? (
                  <Text style={styles.empty}>Não existem Ações Fiscalizadoras.</Text>
                ) : (
                  acoes.map((acao, index) => (
                    <View
                      style={styles.card}
                      key={[
                        acao.TipoFiscalizacao,
                        acao.NRInscricao,
                        acao.NRAnoFiscalizacao,
                        index,
                      ]
                        .map((parte) => (parte == null ? '' : String(parte)))
                        .join('|')}
                    >
                      {linha('Tipo de fiscalização', acao.TipoFiscalizacao)}
                      {linha('Quantidade de ações', acao.QTFiscalizacao != null ? String(acao.QTFiscalizacao) : undefined)}
                      {linha('Ano', acao.NRAnoFiscalizacao)}
                    </View>
                  ))
                )}
              </View>
            </>
          ) : (
            <Text style={styles.empty}>Nenhum histórico foi retornado para esta empresa.</Text>
          )
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
