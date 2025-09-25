import React from 'react';
import { Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Icon from '@/components/Icon';
import theme from '@/theme';
import type { ConsultarAutorizadasStackParamList } from '@/types/types';
import homeStyles from '../styles';

import ConsultarAutorizadasMenu from './MenuScreen';
import CnpjRazao from './CnpjRazao';
import Modalidade from './Modalidade';
import Embarcacao from './Embarcacao';
import Instalacao from './Instalacao';

const Stack = createNativeStackNavigator<ConsultarAutorizadasStackParamList>();

export default function ConsultarAutorizadasNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => screenOptions(navigation)}>
      <Stack.Screen name="Menu" component={ConsultarAutorizadasMenu} options={{ headerShown: false }} />
      <Stack.Screen name="CnpjRazao" component={CnpjRazao} options={{ title: 'Por CNPJ / Razão Social' }} />
      <Stack.Screen name="Modalidade" component={Modalidade} options={{ title: 'Por Modalidade' }} />
      <Stack.Screen name="Embarcacao" component={Embarcacao} options={{ title: 'Por Embarcação' }} />
      <Stack.Screen name="Instalacao" component={Instalacao} options={{ title: 'Por Instalação' }} />
    </Stack.Navigator>
  );
}

function screenOptions(
  navigation: NativeStackNavigationProp<ConsultarAutorizadasStackParamList>,
) {
  return {
    headerStyle: { backgroundColor: theme.colors.primaryDark },
    headerTitleStyle: { fontSize: 18, fontWeight: '600' },
    headerTintColor: theme.colors.surface,
    headerTitleAlign: 'center' as const,
    headerLeft: () => (
      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        style={homeStyles.headerButton}
        hitSlop={8}
      >
        <Icon name="arrow-back" size={24} color={theme.colors.surface} />
      </Pressable>
    ),
  };
}
