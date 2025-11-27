import React, { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import SelectField from '../components/SelectField';
import type { Instalacao, ServicosNaoAutorizadosStackParamList } from '../types';

const ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];
const municipiosSugeridos = ['Recife', 'Belém', 'Manaus', 'Fortaleza', 'Macapá'];

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'CadastrarInstalacao'>;

export default function CadastrarInstalacao({ navigation, route }: Props) {
  const { prestador, area } = route.params;
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [uf, setUf] = useState<string | null>(prestador.uf ?? null);
  const [municipio, setMunicipio] = useState<string | null>(prestador.municipio ?? null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const ufOptions = useMemo(() => ufs.map(sigla => ({ label: sigla, value: sigla })), []);

  const municipioOptions = useMemo(() => {
    const base = new Set<string>();
    municipiosSugeridos.forEach(c => base.add(c));
    if (prestador.municipio) base.add(prestador.municipio);
    return Array.from(base).map(cidade => ({ label: cidade, value: cidade }));
  }, [prestador.municipio]);

  const copiarRazaoSocial = () => {
    setNome(prestador.razaoSocial);
  };

  const copiarEmpresa = () => {
    if (prestador.razaoSocial && !nome) setNome(prestador.razaoSocial);
    if (prestador.endereco) setEndereco(prestador.endereco);
    if (prestador.municipio) setMunicipio(prestador.municipio);
    if (prestador.uf) setUf(prestador.uf);
  };

  const handleSalvar = () => {
    if (!nome.trim()) {
      Alert.alert('Nome obrigatório', 'Informe o nome da instalação.');
      return;
    }

    if (!endereco.trim()) {
      Alert.alert('Endereço obrigatório', 'Informe o endereço da instalação.');
      return;
    }

    const instalacao: Instalacao = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      complemento: complemento || undefined,
      numero: numero || undefined,
      bairro: bairro || undefined,
      cep: cep || undefined,
      uf: uf || undefined,
      municipio: municipio || undefined,
      latitude: lat || undefined,
      longitude: lng || undefined,
    };

    navigation.navigate('Equipe', { prestador, area, instalacao });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>Cadastrar Instalação</Text>

        <View style={{ gap: theme.spacing.sm }}>
          <TextInput
            placeholder="Digite o Nome da Instalação"
            placeholderTextColor={theme.colors.muted}
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
          <Pressable style={styles.secondaryButton} onPress={copiarRazaoSocial}>
            <Text style={styles.secondaryLabel}>Copiar Razão Social</Text>
          </Pressable>
        </View>

        <View style={{ gap: theme.spacing.sm }}>
          <TextInput
            placeholder="Rua, Travessa, Avenida, Logradouro, etc."
            placeholderTextColor={theme.colors.muted}
            value={endereco}
            onChangeText={setEndereco}
            style={styles.input}
          />
          <TextInput
            placeholder="Complemento"
            placeholderTextColor={theme.colors.muted}
            value={complemento}
            onChangeText={setComplemento}
            style={styles.input}
          />
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <TextInput
              placeholder="Número"
              placeholderTextColor={theme.colors.muted}
              value={numero}
              onChangeText={setNumero}
              style={[styles.input, { flex: 1 }]}
            />
            <TextInput
              placeholder="CEP"
              placeholderTextColor={theme.colors.muted}
              value={cep}
              onChangeText={setCep}
              style={[styles.input, { flex: 1 }]}
            />
          </View>
          <TextInput
            placeholder="Bairro"
            placeholderTextColor={theme.colors.muted}
            value={bairro}
            onChangeText={setBairro}
            style={styles.input}
          />
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <View style={{ flex: 1 }}>
              <SelectField
                label="UF"
                placeholder="UF"
                value={uf}
                onSelect={setUf}
                options={ufOptions}
              />
            </View>
            <View style={{ flex: 1 }}>
              <SelectField
                label="Município"
                placeholder="Município"
                value={municipio}
                onSelect={setMunicipio}
                options={municipioOptions}
              />
            </View>
          </View>
        </View>

        <Pressable style={styles.secondaryButton} onPress={copiarEmpresa}>
          <Text style={styles.secondaryLabel}>Copiar da Empresa Selecionada</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <TextInput
            placeholder="Latitude"
            placeholderTextColor={theme.colors.muted}
            value={lat}
            onChangeText={setLat}
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            placeholder="Longitude"
            placeholderTextColor={theme.colors.muted}
            value={lng}
            onChangeText={setLng}
            style={[styles.input, { flex: 1 }]}
          />
        </View>

        <Pressable
          onPress={handleSalvar}
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

const styles = {
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    padding: theme.spacing.md,
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#6CB6E3',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  secondaryLabel: { color: theme.colors.surface, fontWeight: '700' },
};
