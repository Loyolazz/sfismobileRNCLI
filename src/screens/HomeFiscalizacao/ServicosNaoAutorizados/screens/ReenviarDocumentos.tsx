import React, { useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import theme from '@/theme';
import type { Anexo, ServicosNaoAutorizadosStackParamList } from '../types';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'ReenviarDocumentos'>;

export default function ReenviarDocumentos({ route }: Props) {
  const { anexos } = route.params;
  const [selecionados, setSelecionados] = useState<Anexo[]>([]);

  const toggle = (item: Anexo) => {
    setSelecionados(prev => {
      if (prev.some(doc => doc.id === item.id)) {
        return prev.filter(doc => doc.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const reenviar = () => {
    Alert.alert('Envio realizado', `${selecionados.length} documento(s) reenviado(s) ao SEI.`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.md, flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>
          Reenviar Documentos (SEI)
        </Text>
        <Text style={{ color: theme.colors.muted }}>
          Selecione os anexos que precisam ser reenviados.
        </Text>

        <FlatList
          data={anexos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const ativo = selecionados.some(doc => doc.id === item.id);
            return (
              <Pressable onPress={() => toggle(item)} style={[styles.card, ativo && styles.cardAtivo]}>
                <Text style={{ fontWeight: '700', color: theme.colors.text }}>{item.nome}</Text>
                <Text style={{ color: item.obrigatorio ? theme.colors.error : theme.colors.muted }}>
                  {item.obrigatorio ? 'Obrigatório' : 'Opcional'}
                </Text>
                <Text style={{ marginTop: 4, color: ativo ? theme.colors.primary : theme.colors.muted }}>
                  {ativo ? 'Selecionado' : 'Tocar para selecionar'}
                </Text>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
          contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
        />

        <Pressable
          onPress={reenviar}
          style={{
            backgroundColor: theme.colors.primaryDark,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radius.md,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: theme.colors.surface, fontWeight: '700' }}>ENVIAR SELECIONADOS</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardAtivo: { borderColor: theme.colors.primaryDark },
};
