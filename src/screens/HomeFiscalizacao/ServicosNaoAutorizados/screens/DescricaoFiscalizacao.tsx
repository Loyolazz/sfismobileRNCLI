import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import type { ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'DescricaoFiscalizacao'>;

const MAX_TAMANHO = 500;

export default function DescricaoFiscalizacao({ route, navigation }: Props) {
  const { prestador, area, instalacao, equipe } = route.params;
  const [texto, setTexto] = useState('');

  const handleSalvar = () => {
    Alert.alert('Rascunho salvo', 'Descrição registrada localmente.');
  };

  const handleProximo = () => {
    navigation.navigate('SelecaoIrregularidades', {
      prestador,
      area,
      instalacao,
      equipe,
      descricao: texto,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
          Descreva sua fiscalização
        </Text>
        <Text style={{ color: theme.colors.muted }}>
          Inclua os fatos observados, referência aos documentos e evidências coletadas.
        </Text>

        <TextInput
          multiline
          numberOfLines={6}
          maxLength={MAX_TAMANHO}
          placeholder="Descreva o ocorrido"
          placeholderTextColor={theme.colors.muted}
          value={texto}
          onChangeText={setTexto}
          style={{
            minHeight: 140,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: '#D0D5DD',
            padding: theme.spacing.md,
            textAlignVertical: 'top',
          }}
        />
        <Text style={{ alignSelf: 'flex-end', color: theme.colors.muted }}>
          {texto.length}/{MAX_TAMANHO}
        </Text>

        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <Pressable style={styles.secondaryButton} onPress={() => Alert.alert('Anexo', 'Funcionalidade ilustrativa')}>
            <Text style={styles.secondaryLabel}>Anexar foto</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => Alert.alert('Áudio', 'Funcionalidade ilustrativa')}>
            <Text style={styles.secondaryLabel}>Gravar áudio</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleSalvar}
          style={{
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radius.md,
            backgroundColor: '#E2E8F0',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>SALVAR E SAIR</Text>
        </Pressable>

        <Pressable
          onPress={handleProximo}
          style={{
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.primaryDark,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>PRÓXIMO</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  secondaryButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  secondaryLabel: { color: theme.colors.text, fontWeight: '700' },
};
