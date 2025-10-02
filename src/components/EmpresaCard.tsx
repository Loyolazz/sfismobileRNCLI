import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import type { Empresa } from '@/api/operations/consultarEmpresas';
import theme from '@/theme';
import { formatCnpj, formatDate } from '@/utils/formatters';

type Props = {
  empresa: Empresa;
  onPress?: () => void;
};

export default function EmpresaCard({ empresa, onPress }: Props) {
  const travessia = (empresa.Modalidade ?? '').toLowerCase().includes('travessia');
  const instrumento =
    empresa.DescricaoNRInstrumento?.trim() ||
    (empresa.NRInstrumento ? `Instrumento: ${empresa.NRInstrumento}` : '');
  const ultimoAditamento = formatDate(empresa.DTAditamento);
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && onPress ? styles.cardPressed : null,
        !onPress ? styles.cardDisabled : null,
      ]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `Abrir detalhes da empresa ${empresa.NORazaoSocial}` : undefined}
    >
      <Text style={styles.title}>{empresa.NORazaoSocial}</Text>
      <Text style={styles.subtitle}>
        CNPJ: {formatCnpj(empresa.NRInscricao)}
        {empresa.SGUF ? ` • ${empresa.SGUF}` : ''}
        {empresa.NOMunicipio ? ` - ${empresa.NOMunicipio}` : ''}
        {empresa.isAutoridadePortuaria ? ' • Autoridade Portuária' : ''}
      </Text>

      {!!empresa.DSEndereco && (
        <Text style={styles.row}>
          Endereço: <Text style={styles.emphasis}>{empresa.DSEndereco}</Text>
        </Text>
      )}

      {!!empresa.Modalidade && (
        <Text style={styles.row}>
          Modalidade: <Text style={styles.emphasis}>{empresa.Modalidade}</Text>
        </Text>
      )}

      {!!instrumento && (
        <Text style={styles.row}>{instrumento}</Text>
      )}

      {!!ultimoAditamento && (
        <Text style={styles.row}>
          Data Último Aditamento: <Text style={styles.emphasis}>{ultimoAditamento}</Text>
        </Text>
      )}

      {!!empresa.NRAditamento && (
        <Text style={styles.row}>
          Termo: <Text style={styles.emphasis}>{empresa.NRAditamento}</Text>
        </Text>
      )}

      {typeof empresa.QTDEmbarcacao === 'number' && (
        <Text style={styles.row}>
          Embarcações: <Text style={styles.emphasis}>{empresa.QTDEmbarcacao}</Text>
        </Text>
      )}

      {!!empresa.AreaPPF && (
        <Text style={styles.row}>
          Área PPF: <Text style={styles.emphasis}>{empresa.AreaPPF}</Text>
        </Text>
      )}

      {!!empresa.Instalacao && (
        <Text style={styles.row}>
          {travessia ? 'Travessia' : 'Instalação'}: <Text style={styles.emphasis}>{empresa.Instalacao}</Text>
        </Text>
      )}

      {!!empresa.NRInscricaoInstalacao && empresa.NRInscricaoInstalacao !== empresa.NRInscricao && (
        <Text style={styles.row}>
          CNPJ Instalação: <Text style={styles.emphasis}>{formatCnpj(empresa.NRInscricaoInstalacao)}</Text>
        </Text>
      )}

      {!!empresa.NORazaoSocialInstalacao && empresa.NRInscricaoInstalacao !== empresa.NRInscricao && (
        <Text style={styles.row}>
          Razão Social Instalação: <Text style={styles.emphasis}>{empresa.NORazaoSocialInstalacao}</Text>
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.background,
    gap: 2,
    paddingHorizontal: theme.spacing.xs,
  },
  cardPressed: {
    backgroundColor: theme.colors.background,
    opacity: 0.9,
  },
  cardDisabled: {
    opacity: 0.8,
  },
  title: { fontWeight: '600', color: theme.colors.text },
  subtitle: { color: theme.colors.muted },
  row: { color: theme.colors.muted },
  emphasis: { color: theme.colors.text, fontWeight: '600' },
});

