import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import theme from '@/src/theme';

const options = [
  { label: 'Por CNPJ / Razão Social', route: '/HomeFiscalizacao/ConsultarAutorizadas/CnpjRazao' },
  { label: 'Por Modalidade', route: '/HomeFiscalizacao/ConsultarAutorizadas/Modalidade' },
  { label: 'Por Embarcação', route: '/HomeFiscalizacao/ConsultarAutorizadas/Embarcacao' },
  { label: 'Por Instalação', route: '/HomeFiscalizacao/ConsultarAutorizadas/Instalacao' },
];

export default function ConsultarAutorizadas() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Text style={styles.title}>Selecione o tipo de consulta.</Text>
      {options.map((o) => (
        <Pressable key={o.route} style={styles.option} onPress={() => router.push(o.route)}>
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
