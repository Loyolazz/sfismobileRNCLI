import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { listarMensagensPush, MensagemPush } from '@/src/api/notificacoes';
import { loadSession } from '@/src/services/session';
import Icon from '@/src/components/Icon';
import { goBack } from 'expo-router/build/global-state/routing';

export default function Notificacoes() {
  const [dados, setDados] = useState<MensagemPush[]>([]);

  useEffect(() => {
    async function fetchData() {
      const session = await loadSession();
      const idPerfil = session?.usuario?.IDPerfilFiscalizacao;
      if (!idPerfil) return;
      try {
        const res = await listarMensagensPush(idPerfil);
        const parseDate = (s: string) => {
          const [date, time] = s.split(' ');
          const [d, m, y] = date.split('/').map(Number);
          const [hh, mm, ss] = time.split(':').map(Number);
          return new Date(y, m - 1, d, hh, mm, ss).getTime();
        };
        const ordenadas = [...res].sort(
          (a, b) => parseDate(b.DTEnvio) - parseDate(a.DTEnvio)
        );
        setDados(ordenadas);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  function renderItem({ item }: { item: MensagemPush }) {
    const unread = item.STAtivo === '1';
    return (
      <View style={styles.card}>
        <View style={styles.icon}>
          <Icon
            name={unread ? 'notifications-unread' : 'notifications'}
            size={24}
            color="#0F3C52"
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.title, !unread && styles.readTitle]}>
            {item.DSTituloMensagemPush}
          </Text>
          <Text style={styles.message}>{item.DSMensagemPush}</Text>
          <Text style={styles.date}>{item.DTEnvio}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={dados}
        keyExtractor={(item) => String(item.IDMensagemPush)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}
