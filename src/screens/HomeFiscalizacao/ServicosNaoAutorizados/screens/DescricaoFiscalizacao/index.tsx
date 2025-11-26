import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'DescricaoFiscalizacao'>;

const LIMITE = 500;

export default function DescricaoFiscalizacao({ navigation, route }: Props) {
  const [texto, setTexto] = useState('');
  const { areaAtuacao, equipe, instalacao, interior, prestador } = route.params;

  const restante = useMemo(() => LIMITE - texto.length, [texto.length]);

  const handleProsseguir = useCallback(() => {
    if (!texto.trim()) {
      Alert.alert('Atenção', 'Descreva a fiscalização.');
      return;
    }

    navigation.navigate('Irregularidades', {
      prestador,
      areaAtuacao,
      interior,
      instalacao,
      equipe,
      descricao: texto.trim(),
    });
  }, [areaAtuacao, equipe, instalacao, interior, navigation, prestador, texto]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.titulo}>Descreva sua fiscalização</Text>
      <TextInput
        value={texto}
        onChangeText={(value) => setTexto(value.slice(0, LIMITE))}
        placeholder="Digite aqui..."
        style={styles.textarea}
        multiline
        numberOfLines={8}
      />
      <Text style={styles.contador}>{`${restante} caracteres restantes`}</Text>

      <View style={styles.acoes}>
        <Pressable style={styles.acao} accessibilityRole="button">
          <Text style={styles.acaoTexto}>Anexar foto</Text>
        </Pressable>
        <Pressable style={styles.acao} accessibilityRole="button">
          <Text style={styles.acaoTexto}>Gravar áudio</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressed]}
        onPress={handleProsseguir}
        accessibilityRole="button"
      >
        <Text style={styles.botaoTexto}>PRÓXIMO</Text>
      </Pressable>
    </SafeAreaView>
  );
}
