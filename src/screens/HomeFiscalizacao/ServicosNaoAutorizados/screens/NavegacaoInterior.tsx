import React, { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import SelectField from '../components/SelectField';
import type { ServicosNaoAutorizadosStackParamList } from '../types';

const tiposTransporte = [
  'Longitudinal de Carga',
  'Longitudinal de Passageiros',
  'Longitudinal Misto (Passageiros e Cargas)',
  'Transporte privado de cargas, pessoas e veículos em percurso longitudinal',
  'Transporte regular de passageiros e veículos em percurso de travessia',
  'Transporte regular de cargas em percurso longitudinal',
  'Transporte regular de cargas fracionadas em percurso longitudinal',
  'Transporte regular de cargas e veículos em percurso longitudinal',
  'Transporte regular de passageiros em percurso longitudinal',
  'Transporte regular de passageiros em percurso transversal',
  'Transporte regular de passageiros (MEI)',
  'Travessia de Carga',
];

const trechosPorTipo: Record<string, string[]> = {
  'Longitudinal de Passageiros': [
    'Acará (PA) / Abaetetuba (PA) / Acará (PA)',
    'Afuá (AP) / Macapá (AP) / Afuá (AP)',
    'Ananindeua (PA) / Santana (AP) / Afuá (PA)',
    'Anhembi (SP) / Puerto Indio (PARAGUAI) / Anhembi (SP)',
    'Araçatuba (SP) / Hernandárias (PARAGUAI) / Araçatuba (SP)',
  ],
  'Longitudinal de Carga': [
    'Trecho Industrial',
    'Trecho Rio Negro',
    'Trecho Santarém',
  ],
  'Travessia de Carga': ['Travessia Principal', 'Travessia Alternativa'],
};

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'NavegacaoInterior'>;

export default function NavegacaoInterior({ navigation, route }: Props) {
  const { prestador } = route.params;
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [trechoSelecionado, setTrechoSelecionado] = useState<string | null>(null);

  const tipoOptions = useMemo(
    () => tiposTransporte.map(tipo => ({ label: tipo, value: tipo })),
    [],
  );

  const trechosOptions = useMemo(
    () =>
      (tipoSelecionado ? trechosPorTipo[tipoSelecionado] ?? [] : []).map(trecho => ({
        label: trecho,
        value: trecho,
      })),
    [tipoSelecionado],
  );

  const handleProsseguir = () => {
    if (!tipoSelecionado) {
      Alert.alert('Selecione o tipo de transporte');
      return;
    }

    if (!trechoSelecionado) {
      Alert.alert('Selecione o trecho/linha');
      return;
    }

    const area = {
      tipo: 'navegacao' as const,
      transporte: tipoSelecionado,
      trechos: [trechoSelecionado],
    };
    navigation.navigate('CadastrarInstalacao', { prestador, area });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>Navegação Interior</Text>
        <Text style={{ color: theme.colors.muted }}>
          Informe o tipo de transporte e selecione o trecho/linha para seguir com a fiscalização.
        </Text>

        <SelectField
          label="Tipo Transporte"
          placeholder="Tipo Transporte"
          value={tipoSelecionado}
          onSelect={value => {
            setTipoSelecionado(value);
            setTrechoSelecionado(null);
          }}
          options={tipoOptions}
        />

        <SelectField
          label="Trecho Linha"
          placeholder="Trecho Linha"
          value={trechoSelecionado}
          onSelect={setTrechoSelecionado}
          options={trechosOptions}
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
