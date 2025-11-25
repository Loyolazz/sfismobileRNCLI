import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { listarMunicipios } from '@/api/operations/listarMunicipios';
import SelectField, { type SelectOption } from '@/components/SelectField';
import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';
import { digitsOnly, formatCep, formatCpf, validateCnpj, validateCpf } from '@/utils/documents';
import { formatCnpj } from '@/utils/formatters';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'CadastrarPrestador'>;

type TipoInscricao = 'cnpj' | 'cpf';

const tipoInscricaoOptions: Array<SelectOption<TipoInscricao>> = [
  { label: 'CNPJ', value: 'cnpj' },
  { label: 'CPF', value: 'cpf' },
];

const ufOptions: Array<SelectOption<string>> = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
].map((uf) => ({ label: uf, value: uf }));

type MunicipioOption = SelectOption<string>;

export default function CadastrarPrestador({ navigation }: Props) {
  const [tipoInscricao, setTipoInscricao] = useState<SelectOption<TipoInscricao>>(tipoInscricaoOptions[0]);
  const [razaoSocial, setRazaoSocial] = useState('');
  const [inscricao, setInscricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [numero, setNumero] = useState('');
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [uf, setUf] = useState<SelectOption<string> | undefined>();
  const [municipio, setMunicipio] = useState<MunicipioOption | undefined>();
  const [municipiosOptions, setMunicipiosOptions] = useState<MunicipioOption[]>([]);
  const [carregandoMunicipios, setCarregandoMunicipios] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const inscricaoFormatada = useMemo(() => {
    if (tipoInscricao.value === 'cnpj') return formatCnpj(inscricao);
    return formatCpf(inscricao);
  }, [inscricao, tipoInscricao.value]);

  const cepFormatado = useMemo(() => formatCep(cep), [cep]);

  const carregarMunicipios = useCallback(
    async (sigla: string) => {
      try {
        setCarregandoMunicipios(true);
        const resultado = await listarMunicipios({ nomemunicipio: '', siglauf: sigla });
        const municipios = (resultado?.Municipio ?? []).map<MunicipioOption>((item) => ({
          label: item.NOMunicipio,
          value: item.CDMunicipio,
        }));
        setMunicipiosOptions(municipios);
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível carregar os municípios.');
      } finally {
        setCarregandoMunicipios(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (uf) {
      carregarMunicipios(uf.value);
    } else {
      setMunicipiosOptions([]);
      setMunicipio(undefined);
    }
  }, [carregarMunicipios, uf]);

  const validarFormulario = useCallback(() => {
    const numeroInscricao = digitsOnly(inscricao);
    const numeroEndereco = digitsOnly(numero);
    const numeroCep = digitsOnly(cep);

    if (razaoSocial.trim().length === 0) {
      Alert.alert('Atenção', 'Informe o nome ou a razão social.');
      return false;
    }

    if (tipoInscricao.value === 'cnpj' && !validateCnpj(numeroInscricao)) {
      Alert.alert('Atenção', 'O CNPJ informado é inválido.');
      return false;
    }

    if (tipoInscricao.value === 'cpf' && !validateCpf(numeroInscricao)) {
      Alert.alert('Atenção', 'O CPF informado é inválido.');
      return false;
    }

    if (!numeroEndereco) {
      Alert.alert('Atenção', 'Informe um número válido.');
      return false;
    }

    if (numeroCep.length < 8) {
      Alert.alert('Atenção', 'Informe um CEP válido.');
      return false;
    }

    if (bairro.trim().length === 0) {
      Alert.alert('Atenção', 'Informe o bairro.');
      return false;
    }

    if (!uf) {
      Alert.alert('Atenção', 'Selecione a UF.');
      return false;
    }

    if (!municipio) {
      Alert.alert('Atenção', 'Selecione o município.');
      return false;
    }

    return true;
  }, [bairro, cep, inscricao, municipio, numero, razaoSocial, tipoInscricao.value, uf]);

  const handleSalvar = useCallback(async () => {
    if (!validarFormulario()) return;

    try {
      setSalvando(true);
      const prestador = {
        STCadastrarNovo: true as const,
        TPInscricao: tipoInscricao.value === 'cnpj' ? 1 : 2,
        NRInscricao: digitsOnly(inscricao),
        NORazaoSocial: razaoSocial.trim(),
        DSEndereco: endereco.trim(),
        EDComplemento: complemento.trim(),
        NREndereco: digitsOnly(numero),
        NRCEP: digitsOnly(cep),
        DSBairro: bairro.trim(),
        SGUF: uf?.value ?? '',
        CDMunicipio: municipio?.value ?? '',
        NOMunicipio: municipio?.label,
      };

      navigation.navigate('AreaAtuacao', { prestador });
    } finally {
      setSalvando(false);
    }
  }, [bairro, cep, complemento, endereco, inscricao, municipio, navigation, numero, razaoSocial, tipoInscricao.value, uf, validarFormulario]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Nome ou Razão Social</Text>
        <TextInput
          value={razaoSocial}
          onChangeText={setRazaoSocial}
          placeholder="Digite o nome ou a razão social"
          autoCapitalize="words"
          style={styles.input}
        />

        <View style={styles.row}>
          <View style={styles.colSmall}>
            <SelectField
              label="Tipo"
              value={tipoInscricao}
              options={tipoInscricaoOptions}
              onSelect={setTipoInscricao}
            />
          </View>
          <View style={styles.colBig}>
            <Text style={styles.label}>{tipoInscricao.value === 'cnpj' ? 'CNPJ' : 'CPF'}</Text>
            <TextInput
              value={inscricaoFormatada}
              onChangeText={(text) => setInscricao(digitsOnly(text))}
              placeholder={tipoInscricao.value === 'cnpj' ? 'Digite o CNPJ' : 'Digite o CPF'}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.label}>Endereço</Text>
        <TextInput
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Rua, Travessa, Avenida, Logradouro, etc."
          autoCapitalize="words"
          style={styles.input}
        />

        <Text style={styles.label}>Complemento</Text>
        <TextInput value={complemento} onChangeText={setComplemento} placeholder="Complemento" style={styles.input} />

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
            <Text style={styles.label}>CEP</Text>
            <TextInput
              value={cepFormatado}
              onChangeText={(text) => setCep(digitsOnly(text))}
              placeholder="CEP"
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.label}>Bairro</Text>
        <TextInput value={bairro} onChangeText={setBairro} placeholder="Bairro" style={styles.input} />

        <View style={styles.row}>
          <View style={styles.colSmall}>
            <SelectField label="UF" value={uf} options={ufOptions} onSelect={setUf} />
          </View>
          <View style={styles.colBig}>
            <SelectField
              label={carregandoMunicipios ? 'Carregando municípios...' : 'Município'}
              value={municipio}
              options={municipiosOptions}
              onSelect={setMunicipio}
              disabled={carregandoMunicipios || !uf}
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.botao, (pressed || salvando) && styles.botaoPressed]}
          disabled={salvando}
          onPress={handleSalvar}
          accessibilityRole="button"
          accessibilityLabel="Salvar prestador"
        >
          <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'SALVAR'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
