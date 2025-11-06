import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
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

const iconMap: Record<string, ImageSourcePropType> = {
  [ICONES_AUTORIZACAO.EMBARCACAO]: require('../../assets/new_icons/iconEmbarca.png'),
  [ICONES_AUTORIZACAO.TERMINAL]: require('../../assets/new_icons/iconTerminal.png'),
};

function getIconSource(icone?: string | null): ImageSourcePropType | null {
  if (!icone) {
    return null;
  }
  return iconMap[icone] ?? null;
}

function getIconName(icone?: string | null): string {
  switch (icone) {
    case ICONES_AUTORIZACAO.OPERADOR:
      return 'engineering';
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
  const iconSource = getIconSource(empresa.icone);
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
      <View style={styles.accent} />
      <View style={styles.headerRow}>
        <View style={styles.headerIconWrap}>
          {iconSource ? (
            <Image source={iconSource} style={styles.headerIconImage} />
          ) : (
            <MaterialIcons
              name={iconName}
              size={28}
              color={theme.colors.primary}
              style={styles.headerIconFallback}
            />
          )}
        </View>
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

      <View style={styles.content}>
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
      </View>

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
    position: 'relative',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(11, 53, 86, 0.12)',
    shadowColor: '#0B3556',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    overflow: 'hidden',
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.96,
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: theme.colors.primary,
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  headerIconWrap: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: 'rgba(11, 53, 86, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  headerIconFallback: {
    marginTop: 0,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...theme.typography.heading,
    fontSize: 18,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 13,
  },
  content: {
    gap: theme.spacing.xs,
  },
  row: {
    color: theme.colors.muted,
    lineHeight: 20,
  },
  emphasis: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(11, 53, 86, 0.08)',
  },
  actionButtonSecondary: {
    borderWidth: 1,
    borderColor: 'rgba(11, 53, 86, 0.2)',
    backgroundColor: 'rgba(11, 53, 86, 0.06)',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
  },
  actionButtonSecondaryPressed: {
    backgroundColor: 'rgba(11, 53, 86, 0.12)',
  },
  actionButtonSecondaryText: {
    ...theme.typography.button,
    color: theme.colors.primary,
    fontSize: 14,
  },
});
