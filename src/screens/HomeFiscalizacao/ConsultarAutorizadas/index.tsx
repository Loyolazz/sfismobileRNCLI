import React from 'react';
import { type TextStyle } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import theme from '@/theme';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';
import HeaderBackButton from '../components/HeaderBackButton';

import ConsultarAutorizadasMenu from './MenuScreen';
import CnpjRazao from './CnpjRazao';
import Modalidade from './Modalidade';
import Embarcacao from './Embarcacao';
import Instalacao from './Instalacao';

const Stack = createNativeStackNavigator<ConsultarAutorizadasStackParamList>();

const headerTitleStyle = {
  fontSize: 18,
  fontWeight: '600',
} satisfies Pick<TextStyle, 'fontSize' | 'fontWeight'>;

const baseScreenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: theme.colors.primaryDark },
  headerTitleStyle,
  headerTintColor: theme.colors.surface,
  headerTitleAlign: 'center',
};

const createHeaderLeft = (onPress: () => void): NativeStackNavigationOptions['headerLeft'] =>
  () => <HeaderBackButton onPress={onPress} />;

export default function ConsultarAutorizadasNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }): NativeStackNavigationOptions => ({
        ...baseScreenOptions,
        headerLeft: createHeaderLeft(() => navigation.goBack()),
      })}
    >
      <Stack.Screen name="Menu" component={ConsultarAutorizadasMenu} options={{ headerShown: false }} />
      <Stack.Screen name="CnpjRazao" component={CnpjRazao} options={{ title: 'Por CNPJ / Razão Social' }} />
      <Stack.Screen name="Modalidade" component={Modalidade} options={{ title: 'Por Modalidade' }} />
      <Stack.Screen name="Embarcacao" component={Embarcacao} options={{ title: 'Por Embarcação' }} />
      <Stack.Screen name="Instalacao" component={Instalacao} options={{ title: 'Por Instalação' }} />
    </Stack.Navigator>
  );
}

