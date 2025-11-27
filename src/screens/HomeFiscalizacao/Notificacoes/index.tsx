import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import Icon from '@/components/Icon';
import { listarMensagensPush, type MensagemPush } from '@/api/operations/listarMensagensPush';
import { loadSession } from '@/services/session';
import type { DrawerParamList } from '@/types/types';
import theme from '@/theme';
import styles from './styles';

export default function Notificacoes() {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [dados, setDados] = useState<MensagemPush[]>([]);

  useEffect(() => {
    async function fetchData() {
      const session = await loadSession();
      console.log('A',session);
      const idPerfil = session?.usuario?.IDPerfilFiscalizacao;
      if (!idPerfil) return;
      try {
        const res = await listarMensagensPush({
          IDPerfilFiscalizacao: String(idPerfil),
        });
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
            color={theme.colors.primaryDark}
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={styles.headerSpacer} />
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
