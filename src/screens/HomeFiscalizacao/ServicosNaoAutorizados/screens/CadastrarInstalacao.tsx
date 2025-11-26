import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import type { Instalacao, ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'CadastrarInstalacao'>;

export default function CadastrarInstalacao({ navigation, route }: Props) {
  const { prestador, area } = route.params;
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [endereco, setEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleSalvar = () => {
    if (!nome.trim()) {
      Alert.alert('Nome obrigatório', 'Informe o nome da instalação.');
      return;
    }

    const instalacao: Instalacao = {
      nome: nome.trim(),
      tipo: tipo || 'Instalação não informada',
      endereco: endereco || 'Endereço não informado',
      complemento: complemento || undefined,
      latitude: lat || undefined,
      longitude: lng || undefined,
    };

    navigation.navigate('Equipe', { prestador, area, instalacao });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
          Cadastrar Instalação
        </Text>
        <Text style={{ color: theme.colors.muted }}>
          Preencha os dados da instalação fiscalizada para seguir para a equipe.
        </Text>

        <TextInput
          placeholder="Nome da instalação"
          placeholderTextColor={theme.colors.muted}
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <TextInput
          placeholder="Tipo"
          placeholderTextColor={theme.colors.muted}
          value={tipo}
          onChangeText={setTipo}
          style={styles.input}
        />
        <TextInput
          placeholder="Endereço completo"
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
