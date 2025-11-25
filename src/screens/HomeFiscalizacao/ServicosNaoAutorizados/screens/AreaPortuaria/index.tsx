import React, { useCallback, useState } from 'react';
import { Alert, Pressable, SafeAreaView, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import SelectField, { type SelectOption } from '@/components/SelectField';
import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import { salvarAreaPrestador } from '../../utils';
import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'AreaPortuaria'>;

type AreaPortuaria = 'tup' | 'registro';

const areaOptions: Array<SelectOption<AreaPortuaria>> = [
  { label: 'TUP', value: 'tup' },
  { label: 'Registro', value: 'registro' },
];

export default function AreaPortuaria({ navigation, route }: Props) {
  const { prestador } = route.params;
  const [areaPortuaria, setAreaPortuaria] = useState<SelectOption<AreaPortuaria> | undefined>();
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = useCallback(async () => {
    if (!areaPortuaria) {
      Alert.alert('Atenção', 'Selecione a área portuária.');
      return;
    }

    try {
      setSalvando(true);
      await salvarAreaPrestador(prestador, areaPortuaria.value);
      Alert.alert('Sucesso', 'Área portuária salva com sucesso.', undefined, {
        onDismiss: () => navigation.popToTop(),
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a área portuária.');
    } finally {
      setSalvando(false);
    }
  }, [areaPortuaria, navigation, prestador]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <SelectField
        label="Área Portuária"
        value={areaPortuaria}
        options={areaOptions}
        onSelect={setAreaPortuaria}
      />

      <Pressable
        style={({ pressed }) => [styles.botao, (pressed || salvando) && styles.botaoPressed]}
        onPress={handleSalvar}
        disabled={salvando}
        accessibilityRole="button"
        accessibilityLabel="Confirmar área portuária"
      >
        <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'PROSSEGUIR'}</Text>
      </Pressable>
    </SafeAreaView>
  );
}
