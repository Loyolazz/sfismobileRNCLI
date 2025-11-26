import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { salvarInstalacaoServicoNaoAutorizado } from '@/api/servicosNaoAutorizados';
import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';
import { digitsOnly, formatCep } from '@/utils/documents';
import { loadSession } from '@/services/session';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'Instalacao'>;

export default function Instalacao({ navigation, route }: Props) {
  const { prestador, areaAtuacao, interior } = route.params;
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [municipio, setMunicipio] = useState(prestador.NOMunicipio ?? '');
  const [cep, setCep] = useState(prestador.NRCEP?.toString() ?? '');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [salvando, setSalvando] = useState(false);

  const cepFormatado = useMemo(() => formatCep(cep), [cep]);

  const handleSalvar = useCallback(async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome da instalação.');
      return;
    }
    if (!tipo.trim()) {
      Alert.alert('Atenção', 'Informe o tipo da instalação.');
      return;
    }
    if (!endereco.trim()) {
      Alert.alert('Atenção', 'Informe o endereço.');
      return;
    }

    try {
      setSalvando(true);
      const session = await loadSession();
      const payload = {
        codigoMunicipio: prestador.CDMunicipio ?? '',
        complementoEndereco: complemento,
        descricaoEndereco: endereco,
        dsLatitude: latitude,
        dsLongitude: longitude,
        nomeBairro: bairro,
        nomeInstalacao: nome,
        noUsuario: session?.usuario?.NOUsuario ?? 'Fiscal',
        numeroCEP: digitsOnly(cep),
        numeroEndereco: Number(digitsOnly(numero)) || 0,
        numeroInscricao: prestador.NRInscricao,
      };

      await salvarInstalacaoServicoNaoAutorizado(payload);

      navigation.navigate('Equipe', {
        prestador,
        areaAtuacao,
        interior,
        instalacao: {
          nome,
          tipo,
          endereco: `${endereco} ${numero}`.trim(),
          bairro,
          municipio,
          cep: cepFormatado,
          latitude,
          longitude,
        },
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a instalação.');
    } finally {
      setSalvando(false);
    }
  }, [areaAtuacao, bairro, cep, cepFormatado, complemento, endereco, interior, municipio, navigation, nome, numero, prestador, tipo, latitude, longitude]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Nome da instalação</Text>
        <TextInput value={nome} onChangeText={setNome} placeholder="Nome" style={styles.input} />

        <Text style={styles.label}>Tipo</Text>
        <TextInput value={tipo} onChangeText={setTipo} placeholder="Tipo" style={styles.input} />

        <Text style={styles.label}>Endereço</Text>
        <TextInput value={endereco} onChangeText={setEndereco} placeholder="Endereço" style={styles.input} />

        <View style={styles.row}>
          <View style={styles.colSmall}>
            <Text style={styles.label}>Número</Text>
            <TextInput
              value={numero}
              onChangeText={(text) => setNumero(digitsOnly(text))}
              placeholder="Número"
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
          <View style={styles.colBig}>
            <Text style={styles.label}>Complemento</Text>
            <TextInput value={complemento} onChangeText={setComplemento} placeholder="Complemento" style={styles.input} />
          </View>
        </View>

        <Text style={styles.label}>Bairro</Text>
        <TextInput value={bairro} onChangeText={setBairro} placeholder="Bairro" style={styles.input} />

        <Text style={styles.label}>Município</Text>
        <TextInput value={municipio} onChangeText={setMunicipio} placeholder="Município" style={styles.input} />

        <Text style={styles.label}>CEP</Text>
        <TextInput
          value={cepFormatado}
          onChangeText={(text) => setCep(digitsOnly(text))}
          placeholder="CEP"
          keyboardType="number-pad"
          style={styles.input}
        />

        <View style={styles.row}>
          <View style={styles.colSmall}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput value={latitude} onChangeText={setLatitude} placeholder="Latitude" style={styles.input} />
          </View>
          <View style={styles.colSmall}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput value={longitude} onChangeText={setLongitude} placeholder="Longitude" style={styles.input} />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.botao, (pressed || salvando) && styles.botaoPressed]}
          onPress={handleSalvar}
          disabled={salvando}
        >
          <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'PROSSEGUIR'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
