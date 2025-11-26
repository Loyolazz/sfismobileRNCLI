import React from 'react';
import { type TextStyle } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import HeaderBackButton from '@/components/HeaderBackButton';
import theme from '@/theme';

import ConsultaPrestador from './screens/ConsultaPrestador';
import ResultadoPesquisa from './screens/ResultadoPesquisa';
import CadastroPrestador from './screens/CadastroPrestador';
import AreaAtuacao from './screens/AreaAtuacao';
import NavegacaoInterior from './screens/NavegacaoInterior';
import AreaPortuaria from './screens/AreaPortuaria';
import CadastrarInstalacao from './screens/CadastrarInstalacao';
import Equipe from './screens/Equipe';
import DescricaoFiscalizacao from './screens/DescricaoFiscalizacao';
import SelecaoIrregularidades from './screens/SelecaoIrregularidades';
import ResultadoFiscalizacao from './screens/ResultadoFiscalizacao';
import AutoInfracao from './screens/AutoInfracao';
import Processo from './screens/Processo';
import ReenviarDocumentos from './screens/ReenviarDocumentos';
import type { ServicosNaoAutorizadosStackParamList } from './types';

const Stack = createNativeStackNavigator<ServicosNaoAutorizadosStackParamList>();

const headerTitleStyle = { fontSize: 18, fontWeight: '600' } satisfies Pick<TextStyle, 'fontSize' | 'fontWeight'>;

const baseScreenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: theme.colors.primaryDark },
  headerTitleStyle,
  headerTintColor: theme.colors.surface,
  headerTitleAlign: 'center',
};

const createHeaderLeft = (onPress: () => void): NativeStackNavigationOptions['headerLeft'] =>
  () => <HeaderBackButton onPress={onPress} />;

export default function ServicosNaoAutorizadosNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }): NativeStackNavigationOptions => ({
        ...baseScreenOptions,
        headerLeft: createHeaderLeft(() => navigation.goBack()),
      })}
    >
      <Stack.Screen name="ConsultaPrestador" component={ConsultaPrestador} options={{ title: 'Consultar Prestador' }} />
      <Stack.Screen name="ResultadoPesquisa" component={ResultadoPesquisa} options={{ title: 'Resultado da Pesquisa' }} />
      <Stack.Screen name="CadastroPrestador" component={CadastroPrestador} options={{ title: 'Cadastrar Prestador' }} />
      <Stack.Screen name="AreaAtuacao" component={AreaAtuacao} options={{ title: 'Área de atuação' }} />
      <Stack.Screen name="NavegacaoInterior" component={NavegacaoInterior} options={{ title: 'Navegação Interior' }} />
      <Stack.Screen name="AreaPortuaria" component={AreaPortuaria} options={{ title: 'Área Portuária' }} />
      <Stack.Screen name="CadastrarInstalacao" component={CadastrarInstalacao} options={{ title: 'Cadastrar Instalação' }} />
      <Stack.Screen name="Equipe" component={Equipe} options={{ title: 'Equipe' }} />
      <Stack.Screen name="DescricaoFiscalizacao" component={DescricaoFiscalizacao} options={{ title: 'Fiscalização' }} />
      <Stack.Screen
        name="SelecaoIrregularidades"
        component={SelecaoIrregularidades}
        options={{ title: 'Irregularidades' }}
      />
      <Stack.Screen name="ResultadoFiscalizacao" component={ResultadoFiscalizacao} options={{ title: 'Resumo' }} />
      <Stack.Screen name="AutoInfracao" component={AutoInfracao} options={{ title: 'Auto de Infração' }} />
      <Stack.Screen name="Processo" component={Processo} options={{ title: 'Processo' }} />
      <Stack.Screen
        name="ReenviarDocumentos"
        component={ReenviarDocumentos}
        options={{ title: 'Reenviar Documentos' }}
      />
    </Stack.Navigator>
  );
}
