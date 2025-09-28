import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmAndamento() {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Text style={styles.title}>Em Andamento</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor: '#fff' },
  title: { fontSize: 18, color: '#0F3C52' },
});
