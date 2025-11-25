import React, { useCallback, useState } from 'react';
import { Alert, Pressable, SafeAreaView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon from '@/components/Icon';
import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import { salvarAreaPrestador } from '../../utils';
import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'AreaAtuacao'>;

export default function AreaAtuacao({ navigation, route }: Props) {
  const { prestador } = route.params;
  const [loading, setLoading] = useState(false);

  const handleInterior = useCallback(async () => {
    try {
      setLoading(true);
      await salvarAreaPrestador(prestador, 'interior');
      Alert.alert('Sucesso', 'Área de atuação vinculada com sucesso.', undefined, {
        onDismiss: () => navigation.popToTop(),
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a área de atuação.');
    } finally {
      setLoading(false);
    }
  }, [navigation, prestador]);

  const handlePortuaria = useCallback(() => {
    navigation.navigate('AreaPortuaria', { prestador });
  }, [navigation, prestador]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.titulo}>Selecione a área de atuação.</Text>

      <View style={styles.lista}>
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={handleInterior}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Selecionar Navegação Interior"
        >
          <Icon name="directions-boat" size={32} color={styles.cardIcon.color} />
          <Text style={styles.cardTexto}>Navegação Interior</Text>
          <Icon name="chevron-right" size={24} color={styles.cardIcon.color} style={styles.trailingIcon} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={handlePortuaria}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Selecionar Área Portuária"
        >
          <Icon name="local-shipping" size={32} color={styles.cardIcon.color} />
          <Text style={styles.cardTexto}>Área Portuária</Text>
          <Icon name="chevron-right" size={24} color={styles.cardIcon.color} style={styles.trailingIcon} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
