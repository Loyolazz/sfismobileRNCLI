import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import type { Empresa } from '@/api/operations/consultarEmpresas';
import theme from '@/theme';
import { formatCnpj, formatDate } from '@/utils/formatters';
import { ICONES_AUTORIZACAO } from '@/utils/autorizacao';

type Props = {
  empresa: Empresa;
  onPress?: () => void;
  onHistorico?: () => void;
};

function getIconName(icone?: string | null): string {
  switch (icone) {
    case ICONES_AUTORIZACAO.EMBARCACAO:
      return 'directions-boat';
    case ICONES_AUTORIZACAO.OPERADOR:
      return 'engineering';
    case ICONES_AUTORIZACAO.TERMINAL:
      return 'domain';
    default:
      return 'apartment';
  }
}

export default function EmpresaCard({ empresa, onPress, onHistorico }: Props) {
  const travessia = (empresa.Modalidade ?? '').toLowerCase().includes('travessia');
  const instrumento =
    empresa.DescricaoNRInstrumento?.trim() ||
    (empresa.NRInstrumento ? `Instrumento: ${empresa.NRInstrumento}` : '');
  const ultimoAditamento = formatDate(empresa.DTAditamento);
  const iconName = getIconName(empresa.icone);

  const temHistorico = Boolean(onHistorico);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        onPress && pressed ? styles.cardPressed : null,
      ]}
      onPress={onPress}
      disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={
          onPress ? `Selecionar empresa ${empresa.NORazaoSocial}` : undefined
        }
    >
      <View style={styles.headerRow}>
        <MaterialIcons name={iconName} size={24} color={theme.colors.primary} style={styles.headerIcon} />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{empresa.NORazaoSocial}</Text>
          <Text style={styles.subtitle}>
            CNPJ: {formatCnpj(empresa.NRInscricao)}
            {empresa.SGUF ? ` • ${empresa.SGUF}` : ''}
            {empresa.NOMunicipio ? ` - ${empresa.NOMunicipio}` : ''}
            {empresa.isAutoridadePortuaria ? ' • Autoridade Portuária' : ''}
          </Text>
        </View>
      </View>

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

      {!!instrumento && <Text style={styles.row}>{instrumento}</Text>}

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

      {temHistorico ? (
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.actionButtonSecondary, pressed && styles.actionButtonSecondaryPressed]}
            onPress={onHistorico}
            accessibilityRole="button"
            accessibilityLabel={`Abrir histórico de fiscalizações da empresa ${empresa.NORazaoSocial}`}
          >
            <Text style={styles.actionButtonSecondaryText}>Histórico de Fiscalizações</Text>
          </Pressable>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.9,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  headerIcon: {
    marginTop: theme.spacing.xs,
  },
  headerInfo: {
    flex: 1,
  },
  title: { fontWeight: '600', color: theme.colors.text },
  subtitle: { color: theme.colors.muted },
  row: { color: theme.colors.muted },
  emphasis: { color: theme.colors.text, fontWeight: '600' },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  actionButtonSecondary: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
  },
  actionButtonSecondaryPressed: {
    backgroundColor: theme.colors.background,
  },
  actionButtonSecondaryText: {
    ...theme.typography.button,
    color: theme.colors.primary,
    fontSize: 14,
  },
});
