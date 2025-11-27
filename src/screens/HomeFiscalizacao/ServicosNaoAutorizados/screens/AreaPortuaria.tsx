import React, { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import SelectField from '../components/SelectField';
import type { AreaAtuacao, ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'AreaPortuaria'>;

export default function AreaPortuaria({ navigation, route }: Props) {
  const { prestador } = route.params;
  const [areaSelecionada, setAreaSelecionada] = useState<string | null>(null);

  const options = useMemo(
    () => [
      { label: 'TUP', value: 'TUP' },
      { label: 'Registro', value: 'Registro' },
    ],
    [],
  );

  const handleProsseguir = () => {
    if (!areaSelecionada) {
      Alert.alert('Selecione a área portuária');
      return;
    }

    const area: AreaAtuacao = {
      tipo: 'portuaria',
      registro: areaSelecionada,
    };

    navigation.navigate('CadastrarInstalacao', { prestador, area });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>Área Portuária</Text>
        <Text style={{ color: theme.colors.muted }}>
          Selecione o tipo de área portuária antes de seguir com a instalação.
        </Text>

        <SelectField
          label="Área Portuária"
          placeholder="Área Portuária"
          value={areaSelecionada}
          onSelect={setAreaSelecionada}
          options={options}
        />

        <Pressable
          onPress={handleProsseguir}
          style={{
            backgroundColor: '#6CB6E3',
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
