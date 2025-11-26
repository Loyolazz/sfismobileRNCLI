import React, { useMemo } from 'react';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';
import { formatCnpj } from '@/utils/formatters';
import { formatCpf } from '@/utils/documents';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'ResultadoServicos'>;

export default function ResultadoServicos({ navigation, route }: Props) {
  const { empresas, filtro } = route.params;

  const totalTexto = useMemo(() => {
    if (empresas.length === 0) return 'Nenhum serviço localizado.';
    if (empresas.length === 1) return '1 serviço localizado.';
    return `${empresas.length} serviços localizados.`;
  }, [empresas.length]);

  const descricaoFiltro = useMemo(() => {
    const partes = [] as string[];
    if (filtro.nome) partes.push(`Nome: ${filtro.nome}`);
    if (filtro.cnpj) partes.push(`CNPJ: ${formatCnpj(filtro.cnpj)}`);
    if (filtro.embarcacao) partes.push(`Embarcação: ${filtro.embarcacao}`);
    return partes.join(' | ');
  }, [filtro]);

  const renderItem = ({ item }: { item: (typeof empresas)[number] }) => {
    const documento = item.TPInscricao === 1 ? formatCnpj(item.NRInscricao) : formatCpf(item.NRInscricao);
    return (
      <View style={styles.card}>
        <Text style={styles.razao}>{item.NORazaoSocial?.toUpperCase()}</Text>
        <Text style={styles.documento}>{documento}</Text>
        {item.DSEndereco ? <Text style={styles.linha}>{item.DSEndereco}</Text> : null}
        {item.Modalidade ? <Text style={styles.linha}>Modalidade: {item.Modalidade}</Text> : null}
        {item.NRInstrumento ? <Text style={styles.linha}>Instrumento: {item.NRInstrumento}</Text> : null}
        {item.Instalacao ? <Text style={styles.linha}>Instalação: {item.Instalacao}</Text> : null}
        {item.DTAditamento ? <Text style={styles.linha}>Último Aditamento: {item.DTAditamento}</Text> : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.cabecalho}>
        <Text style={styles.total}>{totalTexto}</Text>
        {descricaoFiltro ? <Text style={styles.filtro}>{descricaoFiltro}</Text> : null}
      </View>

      <FlatList
        data={empresas}
        keyExtractor={(item, index) => `${item.NRInscricao}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.vazio}>Nenhum resultado. Volte e tente novamente.</Text>
            <Pressable
              style={({ pressed }) => [styles.botao, pressed && styles.botaoPressed]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.botaoTexto}>VOLTAR</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}
