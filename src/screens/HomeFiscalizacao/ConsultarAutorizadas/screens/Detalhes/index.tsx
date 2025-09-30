import React, { useCallback, useMemo } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

import { formatCnpj, formatDate } from '@/utils/formatters';
import type { ConsultarAutorizadasStackParamList, DrawerParamList } from '@/types/types';
import { mapearFluxoMigracao, type FluxoMigracao } from '../../../../../utils/fluxo';

import type { Empresa } from '@/api/consultarEmpresas';
import styles from './styles';

const infoLinha = (
  label: string,
  valor: string | undefined | null,
  destaque = false,
): React.JSX.Element | null => {
  const texto = typeof valor === 'string' ? valor.trim() : valor;
  if (!texto) return null;
  return (
    <Text style={styles.infoText}>
      {label}: <Text style={[styles.infoValue, destaque && styles.infoValueStrong]}>{texto}</Text>
    </Text>
  );
};

const formatBool = (value?: boolean): string | undefined => {
  if (value == null) return undefined;
  return value ? 'Sim' : 'Não';
};

type DetalhesRouteProp = RouteProp<ConsultarAutorizadasStackParamList, 'Detalhes'>;

type StackNav = NativeStackNavigationProp<ConsultarAutorizadasStackParamList>;
type DrawerNav = DrawerNavigationProp<DrawerParamList>;

export default function Detalhes(): React.JSX.Element {
  const route = useRoute<DetalhesRouteProp>();
  const navigation = useNavigation<StackNav>();
  const drawerNavigation = navigation.getParent<DrawerNav>();

  const empresa = useMemo<Empresa>(() => route.params.empresa, [route.params.empresa]);
  const fluxo = useMemo<FluxoMigracao>(() => mapearFluxoMigracao(empresa), [empresa]);
  const isFluxoMapa = fluxo.tipo === 'MAPA';
  const instrumento = useMemo(() => {
    const descricao = empresa.DescricaoNRInstrumento?.trim();
    if (descricao) return descricao;
    return empresa.NRInstrumento ? `Instrumento: ${empresa.NRInstrumento}` : undefined;
  }, [empresa.DescricaoNRInstrumento, empresa.NRInstrumento]);

  const handleAbrirRotina = useCallback(() => {
    drawerNavigation?.navigate('FiscalizacaoRotina');
  }, [drawerNavigation]);

  const handleAbrirMapa = useCallback(() => {
    navigation.navigate('Mapa', { empresa });
  }, [empresa, navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{empresa.NORazaoSocial}</Text>
          <Text style={styles.subtitle}>{`CNPJ ${formatCnpj(empresa.NRInscricao)}`}</Text>
          {infoLinha('Modalidade', empresa.Modalidade, true)}
          {infoLinha('Município', empresa.NOMunicipio)}
          {infoLinha('UF', empresa.SGUF)}
          {infoLinha('Endereço', empresa.DSEndereco)}
          {infoLinha('Instalação', empresa.Instalacao)}
          {infoLinha('Termo/Instrumento', instrumento)}
          {infoLinha('Área de atuação (PPF)', empresa.AreaPPF)}
          {infoLinha('Último aditamento', formatDate(empresa.DTAditamento))}
          {infoLinha(
            'Quantidade de embarcações',
            typeof empresa.QTDEmbarcacao === 'number' ? String(empresa.QTDEmbarcacao) : undefined,
          )}
          {infoLinha('CNPJ da instalação', empresa.NRInscricaoInstalacao ? formatCnpj(empresa.NRInscricaoInstalacao) : undefined)}
          {infoLinha('Razão social da instalação', empresa.NORazaoSocialInstalacao)}
          {infoLinha('Autoridade Portuária', empresa.AutoridadePortuaria)}
          {infoLinha('Resolução', empresa.NRResolucao)}
          {infoLinha('Documento SEI', empresa.NRDocumentoSEI)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fluxo legado mapeado</Text>
          <Text style={styles.sectionSubtitle}>{fluxo.titulo}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{fluxo.legadoArquivo}</Text>
          </View>
          <Text style={styles.sectionDescription}>{fluxo.descricao}</Text>

          {fluxo.passos.map((passo, index) => (
            <View key={`${passo.titulo}-${index}`} style={styles.stepRow}>
              <View style={styles.stepIndex}>
                <Text style={styles.stepIndexText}>{index + 1}</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepTitle}>{passo.titulo}</Text>
                <Text style={styles.stepDescription}>{passo.descricao}</Text>
                {passo.referencia ? (
                  <Text style={styles.stepReference}>{passo.referencia}</Text>
                ) : null}
              </View>
            </View>
          ))}

          {isFluxoMapa ? (
            <>
              <Pressable
                onPress={handleAbrirMapa}
                style={({ pressed }) => [styles.mapButton, pressed && styles.mapButtonPressed]}
                accessibilityRole="button"
                accessibilityLabel="Abrir mapa da instalação"
              >
                <Text style={styles.mapButtonText}>Visualizar mapa da instalação</Text>
              </Pressable>
              <Text style={styles.mapHelper}>
                O mapa utiliza a API Google Maps v3.53 com cópia offline para fiscalizações em áreas sem conectividade.
              </Text>
            </>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos passos na migração</Text>
          <Text style={styles.sectionDescription}>
            Utilize este mapeamento para planejar as telas equivalentes em React Native e validar com a equipe de fiscalização.
            O botão abaixo já direciona para a tela de rotina da equipe, substituindo o atalho do arquivo rotina.equipe.js.
          </Text>
          <View style={styles.extraInfo}>
            {infoLinha('Contato principal', empresa.NomeContato)}
            {infoLinha('Telefone', empresa.NRTelefone)}
            {infoLinha('E-mail', empresa.Email)}
            {infoLinha('Representante', empresa.NORepresentante)}
            {infoLinha('E-mail do representante', empresa.EERepresentante)}
            {infoLinha(
              'Intimação por telefone',
              formatBool(empresa.STIntimacaoViaTelefone),
            )}
            {infoLinha(
              'Intimação por e-mail',
              formatBool(empresa.STIntimacaoViaEmail),
            )}
            {infoLinha(
              'Contrato de arrendamento',
              typeof empresa.IDContratoArrendamento === 'number'
                ? String(empresa.IDContratoArrendamento)
                : undefined,
            )}
          </View>
          <Pressable
            onPress={handleAbrirRotina}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Abrir rotina da equipe"
          >
            <Text style={styles.actionButtonText}>Abrir rotina da equipe</Text>
          </Pressable>
          <Text style={styles.helperText}>
            Essa navegação permite começar a validar o novo fluxo com as áreas responsáveis sem depender do Cordova.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
