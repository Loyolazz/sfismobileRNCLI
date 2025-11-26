import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'ProcessoFiscalizacao'>;

export default function ProcessoFiscalizacao({ navigation, route }: Props) {
  const { protocolo, anexos } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Fiscalização Registrada</Text>
        <Text style={styles.descricao}>
          {protocolo ? `Protocolo ${protocolo}` : 'Processo ainda não associado a protocolo.'}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressed]}
        onPress={() => navigation.navigate('ReenviarDocumentos', { protocolo, anexos })}
      >
        <Text style={styles.botaoTexto}>REENVIAR DOCUMENTOS</Text>
      </Pressable>
    </SafeAreaView>
  );
}
