import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useDrawerStatus,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import HomeHeader from '../../components/HomeHeader';
import TileGrid from '../../components/TileGrid';
import { loadSession } from '@/services/session';
import { getUltimaVersao } from '@/utils/releases';
import theme from '@/theme';
import styles from './styles';
import type { DrawerParamList } from '@/types/types';
import {
  syncGestorDatabase,
  loadGestorSyncStatus,
  listEmpresasAutorizadasAsync,
} from '@/services/gestorbd';
import { formatDateTime } from '@/utils/dates';
import { listarFrotaAlocada } from '@/api/gestorbd';

const DAY_MS = 24 * 60 * 60 * 1000;

type HomeScreenNav = DrawerNavigationProp<DrawerParamList, 'Home'>;

export default function HomeScreen({
  navigation,
  route,
}: {
  navigation: HomeScreenNav;
  route: any;
}) {
  const [userName, setUserName] = useState<string>('');
  const [expiresIn, setExpiresIn] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSummary, setSyncSummary] = useState<{
    empresas: number;
    frota: number;
    prestadores: number;
  } | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const update = async () => {
      const s = await loadSession();
      const first = s?.usuario?.NOUsuario?.split(' ')?.[0] ?? '';
      if (mounted) {
        setUserName((first || 'Fiscal').toUpperCase());
        if (s?.expiresAt) {
          const diff = s.expiresAt - Date.now();
          if (diff > 0) {
            const days = Math.floor(diff / DAY_MS);
            const hours = Math.floor((diff % DAY_MS) / (60 * 60 * 1000));
            setExpiresIn(`${days}d ${hours}h`);
          } else {
            setExpiresIn('0d');
          }
        }
      }
    };
    update();
    const id = setInterval(update, 60 * 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const flag = route?.params?.showReleases;
    if (flag === '1' || (Array.isArray(flag) && flag.includes('1'))) {
      setShowModal(true);
    }
  }, [route?.params?.showReleases]);

  useEffect(() => {
    let mounted = true;
    loadGestorSyncStatus()
      .then(status => {
        if (!mounted) {
          return;
        }

        if (status?.updatedAt) {
          setLastSync(formatDateTime(status.updatedAt));
        } else {
          setLastSync(null);
        }

        if (status?.counts) {
          setSyncSummary({
            empresas: status.counts.empresas,
            frota: status.counts.frota,
            prestadores: status.counts.prestadores,
          });
        } else {
          setSyncSummary(null);
        }

        console.log('[gestorbd] status inicial carregado', {
          atualizadoEm: status?.updatedAt
            ? formatDateTime(status.updatedAt)
            : null,
          counts: status?.counts,
          cursors: status?.cursors,
        });
      })
      .catch(error => {
        console.error('[gestorbd] falha ao carregar status inicial', error);
      });
    return () => {
      mounted = false;
    };
  }, []);

  type Item = { key: keyof DrawerParamList; title: string; icon: string };
  const items: Item[] = useMemo(
    () => [
      {
        key: 'MinhasFiscalizacoes',
        title: 'Minhas Fiscalizações',
        icon: 'assignment',
      },
      {
        key: 'FiscalizacaoRotina',
        title: 'Fiscalizações de Rotina',
        icon: 'sync',
      },
      {
        key: 'ConsultarAutorizadas',
        title: 'Consultar Autorizadas',
        icon: 'search',
      },
      { key: 'EmAndamento', title: 'Em Andamento', icon: 'hourglass-empty' },
      { key: 'PainelEmpresas', title: 'Painel de Empresas', icon: 'business' },
      {
        key: 'EsquemasOperacionais',
        title: 'Esquemas Operacionais',
        icon: 'icon-esquemas',
      },
      {
        key: 'ServicosNaoAutorizados',
        title: 'Serviços Não Autorizados',
        icon: 'report',
      },
    ],
    [],
  );

  const drawerStatus = useDrawerStatus();
  const isDrawerOpen = drawerStatus === 'open';
  const openDrawer = useCallback(() => navigation.openDrawer(), [navigation]);
  const openNotifications = useCallback(
    () => navigation.navigate('Notificacoes'),
    [navigation],
  );
  const handleSyncGestor = useCallback(async () => {
    if (syncing) {
      return;
    }
    setSyncing(true);
    console.log('[gestorbd] sincronização iniciada');
    try {
      const status = await syncGestorDatabase();
      const formatted = status.updatedAt
        ? formatDateTime(status.updatedAt)
        : null;
      setLastSync(formatted);
      const totals = status.counts ?? { empresas: 0, frota: 0, prestadores: 0 };
      const lastRun = status.lastRun ?? totals;
      setSyncSummary(totals);
      const twoSample = await listarFrotaAlocada();
      const sample = await listEmpresasAutorizadasAsync({
        limit: 3000,
        offset: 0,
      });
      console.log('[gestorbd] sincronização concluída', {
        totais: totals,
        baixados: lastRun,
        cursors: status.cursors,
        empresas: sample.map(item => ({
          ...item,
        })),
        frota: twoSample.map(item => ({
          ...item,
        })),
        prestadores: status.counts.prestadores,
      });
      Alert.alert(
        'Dados atualizados',
        `Empresas baixadas nesta execução: ${lastRun.empresas}\nFrota baixada nesta execução: ${lastRun.frota}\nPrestadores baixados nesta execução: ${lastRun.prestadores}\nTotal de empresas salvas: ${totals.empresas}\nTotal de frota salva: ${totals.frota}\nTotal de prestadores salvos: ${totals.prestadores}`,
      );
    } catch (error) {
      console.error('[gestorbd] sincronização', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível baixar os dados. Tente novamente.';
      Alert.alert('Erro ao atualizar', message);
    } finally {
      setSyncing(false);
    }
  }, [syncing]);
  const closeModal = useCallback(() => {
    setShowModal(false);
    navigation.setParams({ showReleases: undefined });
  }, [navigation]);

  const ultima = getUltimaVersao();
  const versaoStr = String(ultima?.versao ?? '—').replace(/^vers[aã]o\s*/i, '');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={isDrawerOpen ? 'dark-content' : 'light-content'}
        backgroundColor={
          isDrawerOpen ? theme.colors.surface : theme.colors.primaryDark
        }
      />
      <HomeHeader
        onMenuPress={openDrawer}
        onNotificationsPress={openNotifications}
        onSyncPress={handleSyncGestor}
        syncing={syncing}
      />

      <View style={styles.greetingBox}>
        <View style={styles.greetingTexts}>
          <Text style={styles.greetingText}>
            Olá, <Text style={styles.greetingStrong}>{userName}</Text>!
          </Text>
          <Text style={styles.greetingSub}>O que deseja fazer hoje?</Text>
        </View>
        {expiresIn ? (
          <Text style={styles.greetingCounter}>{expiresIn}</Text>
        ) : null}
      </View>

      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          styles.scrollContentExtraPadding,
        ]}
      >
        <View style={styles.section}>
          <TileGrid items={items} navigation={navigation} />
          {lastSync ? (
            <Text style={styles.lastSyncText}>
              Última atualização do banco: {lastSync}
            </Text>
          ) : null}
          {syncSummary ? (
            <Text style={styles.lastSyncText}>
              Registros salvos • Empresas: {syncSummary.empresas} • Frota:{' '}
              {syncSummary.frota} • Prestadores: {syncSummary.prestadores}
            </Text>
          ) : null}
          <Text style={styles.versionText}>Versão WS: {versaoStr}</Text>
        </View>
      </ScrollView>

      <Modal visible={syncing} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Baixando dados do banco...</Text>
          </View>
        </View>
      </Modal>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{ultima?.versao}</Text>
            {(ultima?.novidades ?? []).map((n: string, i: number) => (
              <Text key={i} style={styles.modalItem}>
                • {n}
              </Text>
            ))}
            <Pressable
              onPress={closeModal}
              style={styles.modalButton}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
