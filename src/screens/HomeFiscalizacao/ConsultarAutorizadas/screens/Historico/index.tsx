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

function agruparProcessos(processos: ProcessoHistorico[]): ProcessosAgrupados {
  return processos.reduce<ProcessosAgrupados>(
    (acc, item) => {
      const tipo = item?.TPHistorico?.trim();
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

const getProcessoNumero = (item: ProcessoHistorico): string =>
  item?.CodProcessoFormatado?.trim() || item?.CodProcesso?.trim() || '—';

const linha = (label: string, valor?: string): React.JSX.Element | null => {
  if (!valor) return null;
  return (
    <Text style={styles.infoText}>
      {label}: <Text style={styles.infoValue}>{valor}</Text>
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
    (item: ProcessoHistorico, extras: Array<[string, string | undefined]>) => (
      <View key={`${item.CodProcesso}-${item.NRAutoInfracao}-${item.NRNotificacao}`} style={styles.card}>
        {linha('Nº do processo', getProcessoNumero(item))}
        {linha('Tipo de fiscalização', item.TipoFiscalizacao?.trim())}
        {linha('Situação', item.SituacaoProcesso?.trim())}
        {extras.map(([label, valor]) => linha(label, valor?.trim()))}
      </View>
    ),
    [],
  );

  const renderSecaoProcessos = useCallback(
    (titulo: string, itens: ProcessoHistorico[], extrasMapper: (item: ProcessoHistorico) => Array<[string, string | undefined]>) => {
      if (itens.length === 0) return null;
      return (
        <View style={styles.section} key={titulo}>
          <Text style={styles.sectionTitle}>{titulo}</Text>
          {itens.map((item) => renderProcessoCard(item, extrasMapper(item)))}
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
                    <View style={styles.card} key={`${acao.TipoFiscalizacao}-${acao.NRInscricao}-${index}`}>
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
