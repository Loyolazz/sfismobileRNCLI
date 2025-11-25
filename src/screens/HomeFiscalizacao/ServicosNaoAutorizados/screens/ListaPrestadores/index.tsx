import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';
import { formatCnpj } from '@/utils/formatters';
import { formatCpf } from '@/utils/documents';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'ListaPrestadores'>;

export default function ListaPrestadores({ navigation, route }: Props) {
  const { prestadores } = route.params;

  const totalTexto = useMemo(() => {
    if (prestadores.length === 1) return '1 Prestador encontrado.';
    return `${prestadores.length} Prestadores encontrados.`;
  }, [prestadores.length]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof prestadores)[number] }) => {
      const tipoInscricao = item.TPInscricao === 1 ? 'CNPJ' : 'CPF';
      const inscricao = item.TPInscricao === 1 ? formatCnpj(item.NRInscricao) : formatCpf(item.NRInscricao);
      const endereco = [item.DSEndereco, item.NOMunicipio, item.SGUF].filter(Boolean).join(' - ');

      return (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => navigation.navigate('AreaAtuacao', { prestador: item })}
        >
          <Text style={styles.titulo}>{item.NORazaoSocial}</Text>
          <Text style={styles.descricao}>{`${tipoInscricao}: ${inscricao}`}</Text>
          <Text style={styles.descricao}>{`Endereço: ${endereco}`}</Text>
        </Pressable>
      );
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.resumo}>
        <Text style={styles.resumoTexto}>{totalTexto}</Text>
        <Pressable
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressed]}
          onPress={() => navigation.navigate('CadastrarPrestador')}
          accessibilityRole="button"
          accessibilityLabel="Cadastrar novo prestador"
        >
          <Text style={styles.botaoTexto}>CADASTRAR</Text>
        </Pressable>
      </View>

      <FlatList
        data={prestadores}
        keyExtractor={(item, index) => `${item.NRInscricao}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum prestador encontrado.</Text>}
      />
    </SafeAreaView>
  );
}
