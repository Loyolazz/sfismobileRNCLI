import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { listarPrestadoresServicos } from '@/api/operations';
import type { ListarPrestadoresServicosResult } from '@/api/operations/listarPrestadoresServicos';
import SelectField, { type SelectOption } from '@/components/SelectField';
import { formatCnpj } from '@/utils/formatters';
import { digitsOnly, formatCpf, validateCnpj, validateCpf } from '@/utils/documents';
import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import styles from './styles';

type TipoPesquisa = 'cnpj' | 'cpf' | 'razaosocial';

const tipoOptions: Array<SelectOption<TipoPesquisa>> = [
  { label: 'CNPJ', value: 'cnpj' },
  { label: 'CPF', value: 'cpf' },
  { label: 'Razão Social', value: 'razaosocial' },
];

const labelPorTipo: Record<TipoPesquisa, string> = {
  cnpj: 'Digite o CNPJ',
  cpf: 'Digite o CPF',
  razaosocial: 'Digite a Razão Social',
};

export default function ConsultarPrestador() {
  const navigation = useNavigation<NativeStackNavigationProp<ServicosNaoAutorizadosStackParamList>>();
  const [query, setQuery] = useState('');
  const [tipoPesquisa, setTipoPesquisa] = useState<SelectOption<TipoPesquisa>>(tipoOptions[0]);
  const [loading, setLoading] = useState(false);

  const placeholder = useMemo(() => labelPorTipo[tipoPesquisa.value], [tipoPesquisa.value]);

  const validarConsulta = useCallback(() => {
    const textoLimpo = tipoPesquisa.value === 'razaosocial' ? query.trim() : digitsOnly(query);

    if (textoLimpo.length < 3) {
      Alert.alert('Atenção', 'Informe ao menos 3 caracteres para pesquisar.');
      return { valido: false } as const;
    }

    if (tipoPesquisa.value === 'cnpj' && textoLimpo.length === 14 && !validateCnpj(textoLimpo)) {
      Alert.alert('Atenção', 'O CNPJ informado é inválido.');
      return { valido: false } as const;
    }

    if (tipoPesquisa.value === 'cpf' && textoLimpo.length === 11 && !validateCpf(textoLimpo)) {
      Alert.alert('Atenção', 'O CPF informado é inválido.');
      return { valido: false } as const;
    }

    return { valido: true, textoLimpo } as const;
  }, [query, tipoPesquisa.value]);

  const handleSubmit = useCallback(async () => {
    const resultadoValidacao = validarConsulta();
    if (!resultadoValidacao.valido) return;

    try {
      setLoading(true);
      const payload = {
        textoPesquisa: resultadoValidacao.textoLimpo,
        tipoPesquisa: tipoPesquisa.value,
      };
      const resposta = await listarPrestadoresServicos(payload);
      const empresas: ListarPrestadoresServicosResult['Empresa'] =
        (resposta as ListarPrestadoresServicosResult | undefined)?.Empresa ?? [];

      navigation.navigate('ListaPrestadores', {
        prestadores: empresas,
        filtro: { termo: resultadoValidacao.textoLimpo, tipo: tipoPesquisa.value },
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível consultar prestadores no momento.');
    } finally {
      setLoading(false);
    }
  }, [navigation, tipoPesquisa.value, validarConsulta]);

  const descricaoPesquisa = useMemo(() => {
    if (tipoPesquisa.value === 'cnpj') return 'Consultar por CNPJ';
    if (tipoPesquisa.value === 'cpf') return 'Consultar por CPF';
    return 'Consultar por Razão Social';
  }, [tipoPesquisa.value]);

  const campoFormatado = useMemo(() => {
    if (tipoPesquisa.value === 'cnpj') return formatCnpj(query);
    if (tipoPesquisa.value === 'cpf') return formatCpf(query);
    return query;
  }, [query, tipoPesquisa.value]);

  const handleChangeTexto = useCallback(
    (value: string) => {
      if (tipoPesquisa.value === 'cnpj' || tipoPesquisa.value === 'cpf') {
        setQuery(digitsOnly(value));
        return;
      }
      setQuery(value);
    },
    [tipoPesquisa.value],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.titulo}>Consultar Prestador de Serviço Não Autorizado</Text>

      <SelectField
        label="Tipo de Pesquisa"
        value={tipoPesquisa}
        options={tipoOptions}
        onSelect={setTipoPesquisa}
      />

      <Text style={styles.label}>{placeholder}</Text>
      <TextInput
        value={campoFormatado}
        onChangeText={handleChangeTexto}
        placeholder={placeholder}
        keyboardType={tipoPesquisa.value === 'razaosocial' ? 'default' : 'number-pad'}
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        editable={!loading}
        style={styles.input}
      />

      <Pressable
        style={({ pressed }) => [styles.botao, (pressed || loading) && styles.botaoPressed]}
        disabled={loading}
        onPress={handleSubmit}
        accessibilityRole="button"
        accessibilityLabel={descricaoPesquisa}
      >
        <Text style={styles.botaoTexto}>{loading ? 'Pesquisando...' : 'PESQUISAR'}</Text>
      </Pressable>

      <View style={styles.helper}>
        {tipoPesquisa.value !== 'razaosocial' ? (
          <Text style={styles.helperTexto}>Use somente números. Formatação aplicada automaticamente.</Text>
        ) : (
          <Text style={styles.helperTexto}>Informe ao menos 3 caracteres para pesquisar.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
