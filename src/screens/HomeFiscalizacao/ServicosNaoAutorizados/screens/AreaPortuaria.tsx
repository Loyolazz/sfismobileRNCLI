import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import type { AreaAtuacao, ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'AreaPortuaria'>;

export default function AreaPortuaria({ navigation, route }: Props) {
  const { prestador } = route.params;
  const [registro, setRegistro] = useState('');
  const [tup, setTup] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleProsseguir = () => {
    const area: AreaAtuacao = {
      tipo: 'portuaria',
      registro: registro || 'Registro não informado',
      tup: tup || undefined,
      observacoes: observacoes || undefined,
    };

    navigation.navigate('CadastrarInstalacao', { prestador, area });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>Área Portuária</Text>
        <Text style={{ color: theme.colors.muted }}>
          Informe os dados do TUP ou registro portuário antes de seguir com a instalação.
        </Text>

        <TextInput
          placeholder="Registro / TUP"
          placeholderTextColor={theme.colors.muted}
          value={registro}
          onChangeText={setRegistro}
          style={styles.input}
        />

        <TextInput
          placeholder="Código ou apelido do terminal"
          placeholderTextColor={theme.colors.muted}
          value={tup}
          onChangeText={setTup}
          style={styles.input}
        />

        <TextInput
          placeholder="Observações"
          placeholderTextColor={theme.colors.muted}
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          numberOfLines={3}
          style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
        />

        <Pressable
          onPress={handleProsseguir}
          style={{
            backgroundColor: theme.colors.primaryDark,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radius.md,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>PROSSEGUIR</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    padding: theme.spacing.md,
    fontSize: 16,
  },
};
