import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import theme from '@/theme';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';

const options = [
  { label: 'Por CNPJ / Razão Social', route: 'CnpjRazao' as const },
  { label: 'Por Modalidade', route: 'Modalidade' as const },
  { label: 'Por Embarcação', route: 'Embarcacao' as const },
  { label: 'Por Instalação', route: 'Instalacao' as const },
];

export default function ConsultarAutorizadasMenu() {
  const navigation = useNavigation<NativeStackNavigationProp<ConsultarAutorizadasStackParamList>>();
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Text style={styles.title}>Selecione o tipo de consulta.</Text>
      {options.map((o) => (
        <Pressable
          key={o.route}
          style={styles.option}
          onPress={() => navigation.navigate(o.route)}
          accessibilityRole="button"
          accessibilityLabel={`Abrir consulta ${o.label}`}
        >
          <Text style={styles.optionText}>{o.label}</Text>
        </Pressable>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.md, backgroundColor: theme.colors.surface },
  title: { ...theme.typography.heading, textAlign: 'center', marginBottom: theme.spacing.lg },
  option: { backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.sm },
  optionText: { ...theme.typography.button },
});
