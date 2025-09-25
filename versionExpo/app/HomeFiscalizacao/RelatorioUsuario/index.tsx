import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RelatorioUsuario() {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Text style={styles.title}>RelatorioUsuario</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, color: '#0F3C52' },
});
