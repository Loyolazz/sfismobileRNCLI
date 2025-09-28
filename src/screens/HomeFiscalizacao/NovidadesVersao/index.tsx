import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { releases } from '@/utils/releases';

export default function NovidadesVersao() {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {releases.map((rel) => (
          <View key={rel.versao} style={styles.section}>
            <Text style={styles.version}>{rel.versao}</Text>
            {rel.novidades.map((n, i) => (
              <Text key={i} style={styles.item}>• {n}</Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
