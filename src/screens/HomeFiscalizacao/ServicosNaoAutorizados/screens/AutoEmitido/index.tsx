import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'AutoEmitido'>;

export default function AutoEmitido({ navigation, route }: Props) {
  const { mensagem, detalhes } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Auto de Infração Emitido</Text>
        <Text style={styles.mensagem}>{mensagem}</Text>
        {detalhes ? <Text style={styles.detalhes}>{detalhes}</Text> : null}
      </View>

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressed]}
        onPress={() => navigation.navigate('ProcessoFiscalizacao', { protocolo: 'Pendente', anexos: [] })}
      >
        <Text style={styles.botaoTexto}>VER PROCESSO</Text>
      </Pressable>
    </SafeAreaView>
  );
}
