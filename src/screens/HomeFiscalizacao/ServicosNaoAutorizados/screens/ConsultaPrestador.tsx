import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import { filtroLabel } from '../mockData';
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
        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors.text }}>
            Consultar Prestador de Serviço Não Autorizado
          </Text>

          <Text style={{ color: theme.colors.muted }}>
            Informe o filtro desejado para localizar empresas não autorizadas. Pelo menos um critério é obrigatório.
          </Text>

          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            {filtros.map(option => {
              const active = option.value === filtro;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setFiltro(option.value)}
                  style={{
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.md,
                    borderRadius: theme.radius.md,
                    borderWidth: 1,
                    borderColor: active ? theme.colors.primary : '#D0D5DD',
                    backgroundColor: active ? theme.colors.surface : theme.colors.background,
                  }}
                >
                  <Text
                    style={{
                      color: active ? theme.colors.primary : theme.colors.text,
                      fontWeight: active ? '700' : '500',
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ gap: theme.spacing.xs }}>
            <Text style={{ fontWeight: '600', color: theme.colors.text }}>
              {`Digite o ${filtroLabel[filtro]}`}
            </Text>
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
              backgroundColor: theme.colors.primaryDark,
              paddingVertical: theme.spacing.md,
              borderRadius: theme.radius.md,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text style={{ color: theme.colors.surface, fontSize: 16, fontWeight: '700' }}>
              {loading ? 'PESQUISANDO...' : 'PESQUISAR'}
            </Text>
          </Pressable>

          <Text style={{ color: theme.colors.muted, fontSize: 13 }}>
            As regras de negócio desta tela seguem a UC012: ao menos um filtro deve ser preenchido. Valores inválidos devem ser corrigidos antes de prosseguir.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
