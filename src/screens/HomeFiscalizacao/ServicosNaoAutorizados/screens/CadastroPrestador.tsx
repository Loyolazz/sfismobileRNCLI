import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import { prestadoresBase } from '../mockData';
import type { DocumentoTipo, Prestador, ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'CadastroPrestador'>;

const documentoLabel: Record<DocumentoTipo, string> = {
  cnpj: 'CNPJ',
  cpf: 'CPF',
  razao: 'Documento',
};

export default function CadastroPrestador({ route, navigation }: Props) {
  const [razaoSocial, setRazaoSocial] = useState('');
  const [documentoTipo, setDocumentoTipo] = useState<DocumentoTipo>('cnpj');
  const [documento, setDocumento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [uf, setUf] = useState('');

  const salvar = () => {
    if (!razaoSocial.trim() || !documento.trim()) {
      Alert.alert('Campos obrigatórios', 'Razão social e documento são obrigatórios.');
      return;
    }

    const novoPrestador: Prestador = {
      id: String(Date.now()),
      razaoSocial: razaoSocial.trim().toUpperCase(),
      documento,
      documentoTipo,
      endereco: [endereco, bairro].filter(Boolean).join(' - '),
      municipio: municipio || undefined,
      uf: uf || undefined,
    };

    if (prestadoresBase.every(p => p.documento !== documento)) {
      prestadoresBase.push(novoPrestador);
    }

    if (route.params?.onFinalizarCadastro) {
      route.params.onFinalizarCadastro(novoPrestador);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors.text }}>
            Cadastrar Prestador
          </Text>

          <TextInput
            placeholder="Digite o Nome ou a Razão Social"
            placeholderTextColor={theme.colors.muted}
            value={razaoSocial}
            onChangeText={setRazaoSocial}
            style={styles.input}
          />

          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            {(['cnpj', 'cpf'] as DocumentoTipo[]).map(tipo => {
              const ativo = tipo === documentoTipo;
              return (
                <Pressable
                  key={tipo}
                  onPress={() => setDocumentoTipo(tipo)}
                  style={{
                    flex: 1,
                    paddingVertical: theme.spacing.sm,
                    borderRadius: theme.radius.md,
                    borderWidth: 1,
                    borderColor: ativo ? theme.colors.primary : '#D0D5DD',
                    alignItems: 'center',
                    backgroundColor: ativo ? theme.colors.surface : theme.colors.background,
                  }}
                >
                  <Text style={{ fontWeight: '700', color: ativo ? theme.colors.primary : theme.colors.text }}>
                    {documentoLabel[tipo]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            placeholder={`Digite o ${documentoLabel[documentoTipo]}`}
            placeholderTextColor={theme.colors.muted}
            value={documento}
            onChangeText={setDocumento}
            style={styles.input}
          />

          <TextInput
            placeholder="Rua, Travessa, Avenida, Logradouro, etc."
            placeholderTextColor={theme.colors.muted}
            value={endereco}
            onChangeText={setEndereco}
            style={styles.input}
          />

          <TextInput
            placeholder="Bairro"
            placeholderTextColor={theme.colors.muted}
            value={bairro}
            onChangeText={setBairro}
            style={styles.input}
          />

          <TextInput
            placeholder="Município"
            placeholderTextColor={theme.colors.muted}
            value={municipio}
            onChangeText={setMunicipio}
            style={styles.input}
          />

          <TextInput
            placeholder="UF"
            placeholderTextColor={theme.colors.muted}
            value={uf}
            onChangeText={setUf}
            maxLength={2}
            style={styles.input}
          />

          <Pressable
            onPress={salvar}
            style={{
              backgroundColor: theme.colors.primaryDark,
              paddingVertical: theme.spacing.md,
              borderRadius: theme.radius.md,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>SALVAR</Text>
          </Pressable>
        </View>
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
