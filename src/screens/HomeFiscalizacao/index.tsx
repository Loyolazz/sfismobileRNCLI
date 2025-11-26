import React from 'react';
import { type TextStyle } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerNavigationOptions,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';

import Icon from '@/components/Icon';
import theme from '@/theme';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import type { DrawerParamList, RootStackParamList } from '@/types/types';

import HomeScreen from './HomeScreen';
import MinhasFiscalizacoes from './MinhasFiscalizacoes';
import FiscalizacaoRotina from './FiscalizacaoRotina';
import ConsultarAutorizadas from './ConsultarAutorizadas';
import Equipe from './Equipe';
import EmAndamento from './EmAndamento';
import PainelEmpresas from './PainelEmpresas';
import EsquemasOperacionais from './EsquemasOperacionais';
import ServicosNaoAutorizados from './ServicosNaoAutorizados';
import RelatorioUsuario from './RelatorioUsuario';
import Antaq from './Antaq';
import Tutorial from './Tutorial';
import NovidadesVersao from './NovidadesVersao';
import SituacaoServico from './SituacaoServico';
import Notificacoes from './Notificacoes';
import HeaderBackButton from '../../components/HeaderBackButton';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';

const Drawer = createDrawerNavigator<DrawerParamList>();

const makeDrawerIcon =
  (name: React.ComponentProps<typeof Icon>['name']) =>
  ({ color, size }: { color: string; size: number }) =>
    <Icon name={name} color={color} size={size} />;

const headerTitleStyle = {
  fontSize: 18,
  fontWeight: '600',
} satisfies Pick<TextStyle, 'fontSize' | 'fontWeight'>;

const createHeaderLeft = (onPress: () => void): DrawerNavigationOptions['headerLeft'] =>
  () => <HeaderBackButton onPress={onPress} />;

const defaultScreenOptions = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<DrawerParamList>;
}): DrawerNavigationOptions => ({
  headerStyle: { backgroundColor: theme.colors.primaryDark },
  headerTitleStyle,
  headerTitleAlign: 'center',
  drawerActiveTintColor: theme.colors.primaryDark,
  headerLeft: createHeaderLeft(() => navigation.goBack()),
  swipeEnabled: false,
});

type Props = NativeStackScreenProps<RootStackParamList, 'HomeDrawer'>;

export default function HomeFiscalizacao({ route, navigation }: Props) {
  const { showReleases } = route.params ?? {};
  const handleLogout = useCallback(() => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }, [navigation]);

  const renderDrawerContent = useCallback(
    (props: DrawerContentComponentProps) => (
      <CustomDrawerContent {...props} onLogout={handleLogout} />
    ),
    [handleLogout],
  );

  return (
    <Drawer.Navigator
      screenOptions={defaultScreenOptions}
      drawerContent={renderDrawerContent}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ showReleases }}
        options={{
          headerShown: false,
          swipeEnabled: true,
          drawerIcon: makeDrawerIcon('home'),
          drawerLabel: 'Início',
        }}
      />

      <Drawer.Screen
        name="MinhasFiscalizacoes"
        component={MinhasFiscalizacoes}
        options={{
          title: 'Minhas Fiscalizações',
          drawerIcon: makeDrawerIcon('assignment'),
          drawerItemStyle: { display: 'none' },
          headerTintColor: theme.colors.surface,
        }}
      />
      <Drawer.Screen
        name="FiscalizacaoRotina"
        component={FiscalizacaoRotina}
        options={{
          title: 'Fiscalizações de Rotina',
          drawerIcon: makeDrawerIcon('sync'),
          drawerItemStyle: { display: 'none' },
          headerTintColor: theme.colors.surface,
        }}
      />
      <Drawer.Screen
        name="ConsultarAutorizadas"
        component={ConsultarAutorizadas}
        options={({ route: drawerRoute }) => {
          const focusedRoute =
            getFocusedRouteNameFromRoute(drawerRoute) ?? 'Menu';
          const showDrawerHeader = focusedRoute === 'Menu';

          return {
            title: 'Consultar Autorizadas',
            drawerIcon: makeDrawerIcon('search'),
            drawerItemStyle: { display: 'none' },
            headerTintColor: theme.colors.surface,
            headerShown: showDrawerHeader,
          };
        }}
      />
      <Drawer.Screen
        name="Equipe"
        component={Equipe}
        options={{
          title: 'Equipe de Fiscalização',
          drawerIcon: makeDrawerIcon('groups'),
          drawerItemStyle: { display: 'none' },
          headerTintColor: theme.colors.surface,
        }}
      />
      <Drawer.Screen
        name="RelatorioUsuario"
        component={RelatorioUsuario}
        options={{
          title: 'Relatório do Usuário',
          drawerIcon: makeDrawerIcon('description'),
          headerTintColor: theme.colors.surface,
        }}
      />
      <Drawer.Screen
        name="Antaq"
        component={Antaq}
        options={{
          title: 'A ANTAQ',
          drawerIcon: makeDrawerIcon('info'),
          headerTintColor: theme.colors.surface,
        }}
      />
      <Drawer.Screen
        name="Tutorial"
        component={Tutorial}
        options={{
          title: 'Tutorial',
          drawerIcon: makeDrawerIcon('menu-book'),
          headerTintColor: theme.colors.surface,
        }}
      />
      <Drawer.Screen
        name="NovidadesVersao"
        component={NovidadesVersao}
        options={{
          title: 'Novidades da Versão',
          drawerIcon: makeDrawerIcon('newReleases'),
          headerTintColor: theme.colors.surface,
        }}
      />
      <Drawer.Screen
        name="SituacaoServico"
        component={SituacaoServico}
        options={{
          title: 'Situação do Serviço',
          drawerIcon: makeDrawerIcon('wifi'),
          headerTintColor: theme.colors.surface,
        }}
      />

      <Drawer.Screen
        name="EmAndamento"
        component={EmAndamento}
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'EmAndamento',
          headerTintColor: theme.colors.surface,
        }}
      />
      <Drawer.Screen
        name="PainelEmpresas"
        component={PainelEmpresas}
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Painel Empresas',
          headerTintColor: theme.colors.surface,
        }}
      />
      <Drawer.Screen
        name="EsquemasOperacionais"
        component={EsquemasOperacionais}
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Esquema Operacionais',
          headerTintColor: theme.colors.surface,
        }}
      />
      <Drawer.Screen
        name="ServicosNaoAutorizados"
        component={ServicosNaoAutorizados}
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Serviços não autorizados',
          headerShown: false,
          headerTintColor: theme.colors.surface,
        }}
      />
      <Drawer.Screen
        name="Notificacoes"
        component={Notificacoes}
        options={{
          headerShown: false,
          drawerItemStyle: { display: 'none' },
          headerTintColor: theme.colors.surface,
        }}
      />
    </Drawer.Navigator>
  );
}
