import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import styles from './styles';

type Props = NativeStackScreenProps<ServicosNaoAutorizadosStackParamList, 'ReenviarDocumentos'>;

type Anexo = NonNullable<Props['route']['params']['anexos']>[number];

export default function ReenviarDocumentos({ navigation, route }: Props) {
  const [anexos, setAnexos] = useState<Anexo[]>(route.params.anexos ?? []);

  const toggle = useCallback((id: string) => {
    setAnexos((prev) =>
      prev.map((anexo) => (anexo.id === id ? { ...anexo, selecionado: !anexo.selecionado } : anexo)),
    );
  }, []);

  const selecionados = useMemo(() => anexos.filter((a) => a.selecionado), [anexos]);

  const handleEnviar = useCallback(() => {
    if (selecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione ao menos um documento para reenviar.');
      return;
    }
    Alert.alert('Envio', `${selecionados.length} documento(s) reenviado(s).`);
    navigation.goBack();
  }, [navigation, selecionados.length]);

  const renderItem = useCallback(
    ({ item }: { item: Anexo }) => (
      <Pressable
        style={({ pressed }) => [styles.item, (pressed || item.selecionado) && styles.itemSelecionado]}
        onPress={() => toggle(item.id)}
      >
        <Text style={styles.itemTitulo}>{item.nome}</Text>
        <Text style={styles.itemDescricao}>{item.selecionado ? 'Marcado para envio' : 'Toque para selecionar'}</Text>
      </Pressable>
    ),
    [toggle],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Reenviar Documentos</Text>
        <Text style={styles.subtitulo}>Selecione os anexos para reenviar ao SEI.</Text>
      </View>

      <FlatList
        data={anexos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum anexo disponível.</Text>}
      />

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.botaoPressed]}
        onPress={handleEnviar}
        accessibilityRole="button"
      >
        <Text style={styles.botaoTexto}>ENVIAR SELECIONADOS</Text>
      </Pressable>
    </SafeAreaView>
  );
}
