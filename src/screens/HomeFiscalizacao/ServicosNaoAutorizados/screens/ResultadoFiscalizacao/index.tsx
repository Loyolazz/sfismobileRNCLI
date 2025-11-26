import React, { useCallback } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'ResultadoFiscalizacao'>;

export default function ResultadoFiscalizacao({ navigation, route }: Props) {
  const { areaAtuacao, descricao, equipe, instalacao, interior, irregularidades, prestador } = route.params;

  const handleFinalizar = useCallback(() => {
    navigation.navigate('ProcessoFiscalizacao', { protocolo: undefined });
  }, [navigation]);

  const handleEmitirAuto = useCallback(() => {
    navigation.navigate('AutoEmitido', { mensagem: 'Auto de infração emitido com sucesso.' });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>Resumo da Fiscalização</Text>

        <View style={styles.bloco}>
          <Text style={styles.blocoTitulo}>Prestador</Text>
          <Text style={styles.valor}>{prestador.NORazaoSocial?.toUpperCase()}</Text>
          <Text style={styles.valor}>{prestador.NRInscricao}</Text>
        </View>

        <View style={styles.bloco}>
          <Text style={styles.blocoTitulo}>Área</Text>
          <Text style={styles.valor}>{areaAtuacao.descricao}</Text>
          {interior?.descricao ? <Text style={styles.valor}>{interior.descricao}</Text> : null}
        </View>

        <View style={styles.bloco}>
          <Text style={styles.blocoTitulo}>Instalação</Text>
          <Text style={styles.valor}>{instalacao.nome}</Text>
          <Text style={styles.valor}>{instalacao.endereco}</Text>
        </View>

        <View style={styles.bloco}>
          <Text style={styles.blocoTitulo}>Equipe</Text>
          {equipe.map((srv) => (
            <Text key={srv.NRMatriculaServidor} style={styles.valor}>{`${srv.NOUsuario} - ${srv.NOCargo}`}</Text>
          ))}
        </View>

        <View style={styles.bloco}>
          <Text style={styles.blocoTitulo}>Descrição</Text>
          <Text style={styles.valor}>{descricao}</Text>
        </View>

        <View style={styles.bloco}>
          <Text style={styles.blocoTitulo}>Irregularidades</Text>
          {irregularidades.map((ir) => (
            <Text key={ir.IDIrregularidade} style={styles.valor}>{ir.DSIrregularidade}</Text>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressed]}
          onPress={handleFinalizar}
          accessibilityRole="button"
        >
          <Text style={styles.botaoTexto}>FINALIZAR SEM AUTO</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.botaoSecundario, pressed && styles.botaoSecundarioPressed]}
          onPress={handleEmitirAuto}
          accessibilityRole="button"
        >
          <Text style={styles.botaoSecundarioTexto}>EMITIR AUTO</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
