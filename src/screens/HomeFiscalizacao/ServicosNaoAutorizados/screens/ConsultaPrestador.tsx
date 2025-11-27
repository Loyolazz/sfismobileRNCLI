import React, { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import { filtroLabel } from '../mockData';
import SelectField from '../components/SelectField';
import { buscarPrestadoresServico } from '../services';
import type { DocumentoTipo, ServicosNaoAutorizadosStackParamList } from '../types';

const filtros: { label: string; value: DocumentoTipo }[] = [
  { label: 'CNPJ', value: 'cnpj' },
  { label: 'CPF', value: 'cpf' },
  { label: 'Razão Social', value: 'razao' },
];

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'ConsultaPrestador'>;

export default function ConsultaPrestador({ navigation }: Props) {
  const [filtro, setFiltro] = useState<DocumentoTipo>('cnpj');
  const [termo, setTermo] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const filtroOptions = useMemo(
    () =>
      filtros.map(option => ({
        label: option.label,
        value: option.value,
      })),
    [],
  );

  const handlePesquisar = async () => {
    if (!termo.trim()) {
      setErro('Preencha este campo!');
      return;
    }

    setErro('');
    try {
      setLoading(true);
      const encontrados = await buscarPrestadoresServico(filtro, termo);

      navigation.navigate('ResultadoPesquisa', {
        filtro,
        termo,
        resultados: encontrados,
      });
    } catch (error) {
      console.warn('[ServicosNaoAutorizados] Erro ao pesquisar prestadores', error);
      Alert.alert('Erro', 'Não foi possível consultar prestadores no momento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.lg }}>
          <View style={{ gap: theme.spacing.sm }}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors.text }}>Consultar</Text>
            <Text style={{ color: theme.colors.muted }}>
              Selecionar filtro e pesquisar prestadores de serviços não autorizados.
            </Text>
          </View>

          <SelectField
            placeholder="Selecione o filtro"
            value={filtro}
            onSelect={value => setFiltro(value as DocumentoTipo)}
            options={filtroOptions}
          />

          <View style={{ gap: theme.spacing.xs }}>
            <TextInput
              value={termo}
              onChangeText={setTermo}
              placeholder={`Digite o ${filtroLabel[filtro]}`}
              placeholderTextColor={theme.colors.muted}
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: erro ? theme.colors.error : '#D0D5DD',
                padding: theme.spacing.md,
                fontSize: 16,
              }}
            />
            {erro ? <Text style={{ color: theme.colors.error }}>{erro}</Text> : null}
          </View>

          <Pressable
            onPress={handlePesquisar}
            style={{
              backgroundColor: '#6CB6E3',
              paddingVertical: theme.spacing.md,
              borderRadius: theme.radius.md,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: theme.colors.surface, fontSize: 16, fontWeight: '700' }}>
              {loading ? 'PESQUISANDO...' : 'PESQUISAR'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
