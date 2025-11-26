import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  buscarServicosNaoAutorizadosPorEmbarcacao,
  buscarServicosNaoAutorizadosPorEmpresa,
  type ConsultarEmbarcacoesPorNomeOuCapitaniaResult,
  type Empresa,
} from '@/api/servicosNaoAutorizados';
import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';
import { digitsOnly } from '@/utils/documents';
import { formatCnpj } from '@/utils/formatters';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'Buscar'>;

export default function BuscarServico({ navigation }: Props) {
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [embarcacao, setEmbarcacao] = useState('');
  const [loading, setLoading] = useState(false);

  const filtrosTexto = useMemo(() => {
    const filtros = [] as string[];
    if (nomeEmpresa.trim()) filtros.push(`Nome: ${nomeEmpresa.trim()}`);
    if (cnpj.trim()) filtros.push(`CNPJ: ${formatCnpj(digitsOnly(cnpj))}`);
    if (embarcacao.trim()) filtros.push(`Embarcação: ${embarcacao.trim()}`);
    return filtros.join(' | ');
  }, [cnpj, embarcacao, nomeEmpresa]);

  const validar = useCallback(() => {
    if (!nomeEmpresa.trim() && !cnpj.trim() && !embarcacao.trim()) {
      Alert.alert('Atenção', 'Preencha este campo! Informe ao menos um filtro.');
      return false;
    }
    return true;
  }, [cnpj, embarcacao, nomeEmpresa]);

  const handleBuscar = useCallback(async () => {
    if (!validar()) return;
    try {
      setLoading(true);
      const resultados: Empresa[] = [];

      if (nomeEmpresa.trim() || cnpj.trim()) {
        const termo = nomeEmpresa.trim() || digitsOnly(cnpj);
        const empresas = await buscarServicosNaoAutorizadosPorEmpresa(termo);
        resultados.push(...empresas);
      }

      if (embarcacao.trim()) {
        const embarcacoesResposta = await buscarServicosNaoAutorizadosPorEmbarcacao({
          NOEmbarcacao: embarcacao.trim(),
          NRCapitania: '',
        });
        const embarcacoes =
          (embarcacoesResposta as ConsultarEmbarcacoesPorNomeOuCapitaniaResult | undefined)?.EmbarcacaoAutorizada ?? [];
        const mapped: Empresa[] = embarcacoes.map((item) => ({
          NORazaoSocial: item.NoEmbarcacao,
          NRInscricao: item.NRInscricao,
          Modalidade: item.TipoEmbarcacao,
          TPInscricao: item.TPInscricao,
          icone: item.STRegistro ? 'check' : 'close',
        }));
        resultados.push(...mapped);
      }

      navigation.navigate('ResultadoServicos', {
        empresas: resultados,
        filtro: { nome: nomeEmpresa.trim(), cnpj: digitsOnly(cnpj), embarcacao: embarcacao.trim() },
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao consultar serviços não autorizados.');
    } finally {
      setLoading(false);
    }
  }, [cnpj, embarcacao, navigation, nomeEmpresa, validar]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>Informe os filtros para pesquisar serviços não autorizados.</Text>

        <Text style={styles.label}>Nome da Empresa</Text>
        <TextInput value={nomeEmpresa} onChangeText={setNomeEmpresa} placeholder="Nome" style={styles.input} />

        <Text style={styles.label}>CNPJ</Text>
        <TextInput
          value={formatCnpj(digitsOnly(cnpj))}
          onChangeText={(text) => setCnpj(digitsOnly(text))}
          placeholder="CNPJ"
          keyboardType="number-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Nome da Embarcação</Text>
        <TextInput value={embarcacao} onChangeText={setEmbarcacao} placeholder="Nome da embarcação" style={styles.input} />

        <Pressable
          style={({ pressed }) => [styles.botao, (pressed || loading) && styles.botaoPressed]}
          onPress={handleBuscar}
          disabled={loading}
          accessibilityRole="button"
        >
          <Text style={styles.botaoTexto}>{loading ? 'Pesquisando...' : 'PESQUISAR'}</Text>
        </Pressable>

        {filtrosTexto ? <Text style={styles.filtros}>{filtrosTexto}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
