import React from 'react';
import { Pressable } from 'react-native';
import {
    createDrawerNavigator,
    DrawerNavigationOptions,
    DrawerNavigationProp,
} from '@react-navigation/drawer';
import { useLocalSearchParams } from 'expo-router';

import Icon from '@/src/components/Icon';
import theme from '@/src/theme';

import HomeScreen from './HomeScreen';
import CustomDrawerContent from '../../src/components/CustomDrawerContent';
import MinhasFiscalizacoes from './MinhasFiscalizacoes';
import FiscalizacaoRotina from './FiscalizacaoRotina';
import ConsultarAutorizadas from './ConsultarAutorizadas';
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
import type { DrawerParamList } from '@/src/types/types';

const Drawer = createDrawerNavigator<DrawerParamList>();

const makeDrawerIcon =
    (name: React.ComponentProps<typeof Icon>['name']) =>
        ({ color, size }: { color: string; size: number }) => (
            <Icon name={name} color={color} size={size} />
        );

const defaultScreenOptions = ({
    navigation,
}: {
    navigation: DrawerNavigationProp<DrawerParamList>;
}): DrawerNavigationOptions => ({
    headerStyle: { backgroundColor: theme.colors.primaryDark },
    headerTitleStyle: { fontSize: 18, fontWeight: '600' },
    headerTitleAlign: 'center',
    drawerActiveTintColor: theme.colors.primaryDark,
    headerLeft: () => (
        <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={{ paddingHorizontal: 8, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}
            hitSlop={8}
        >
            <Icon name="arrow-back" size={24} color={theme.colors.surface} />
        </Pressable>
    ),
    swipeEnabled: false,
});

export default function HomeFiscalizacao() {
    const params = useLocalSearchParams();
    return (
        <Drawer.Navigator
            screenOptions={defaultScreenOptions}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ showReleases: params.showReleases }}
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
                    headerTintColor: theme.colors.surface
                }}
            />
            <Drawer.Screen
                name="FiscalizacaoRotina"
                component={FiscalizacaoRotina}
                options={{
                    title: 'Fiscalizações de Rotina',
                    drawerIcon: makeDrawerIcon('sync'),
                    drawerItemStyle: { display: 'none' },
                    headerTintColor: theme.colors.surface
                }}
            />
            <Drawer.Screen
                name="ConsultarAutorizadas"
                component={ConsultarAutorizadas}
                options={{
                    title: 'Consultar Autorizadas',
                    drawerIcon: makeDrawerIcon('search'),
                    drawerItemStyle: { display: 'none' },
                    headerTintColor: theme.colors.surface
                }}
            />

            {/* Itens exibidos no Drawer */}
            <Drawer.Screen
                name="RelatorioUsuario"
                component={RelatorioUsuario}
                options={{
                    title: 'Relatório do Usuário',
                    drawerIcon: makeDrawerIcon('description'),
                    headerTintColor: theme.colors.surface
                }}
            />
            <Drawer.Screen
                name="Antaq"
                component={Antaq}
                options={{
                    title: 'A ANTAQ',
                    drawerIcon: makeDrawerIcon('info'),
                    headerTintColor: theme.colors.surface
            }}
            />
            <Drawer.Screen
                name="Tutorial"
                component={Tutorial}
                options={{
                    title: 'Tutorial',
                    drawerIcon: makeDrawerIcon('menu-book'),
                    headerTintColor: theme.colors.surface
                }}
            />
            <Drawer.Screen
                name="NovidadesVersao"
                component={NovidadesVersao}
                options={{
                    title: 'Novidades da Versão',
                    drawerIcon: makeDrawerIcon('newReleases') ,
                    headerTintColor: theme.colors.surface
                }}
            />
            <Drawer.Screen
                name="SituacaoServico"
                component={SituacaoServico}
                options={{
                    title: 'Situação do Serviço',
                    drawerIcon: makeDrawerIcon('wifi'),
                    headerTintColor: theme.colors.surface
                }}
            />

            {/* Rotas ocultas */}
            <Drawer.Screen name="EmAndamento"
                           component={EmAndamento}
                           options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="PainelEmpresas"
                           component={PainelEmpresas}
                           options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="EsquemasOperacionais"
                           component={EsquemasOperacionais}
                           options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="ServicosNaoAutorizados"
                           component={ServicosNaoAutorizados}
                           options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="Notificacoes"
                           component={Notificacoes}
                           options={{
                               headerShown: false,
                               drawerItemStyle: { display: 'none' } }} />
        </Drawer.Navigator>
    );
}
