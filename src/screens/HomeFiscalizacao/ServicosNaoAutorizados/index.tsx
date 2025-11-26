import React from 'react';
import { type TextStyle } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import theme from '@/theme';
import HeaderBackButton from '../../../components/HeaderBackButton';
import type { ServicosNaoAutorizadosStackParamList } from '@/types/types';

import ConsultarPrestador from './screens/ConsultarPrestador';
import ListaPrestadores from './screens/ListaPrestadores';
import CadastrarPrestador from './screens/CadastrarPrestador';
import AreaAtuacao from './screens/AreaAtuacao';
import AreaPortuaria from './screens/AreaPortuaria';
import NavegacaoInterior from './screens/NavegacaoInterior';
import Instalacao from './screens/Instalacao';
import Equipe from './screens/Equipe';
import DescricaoFiscalizacao from './screens/DescricaoFiscalizacao';
import Irregularidades from './screens/Irregularidades';
import ResultadoFiscalizacao from './screens/ResultadoFiscalizacao';
import AutoEmitido from './screens/AutoEmitido';
import ProcessoFiscalizacao from './screens/ProcessoFiscalizacao';
import ReenviarDocumentos from './screens/ReenviarDocumentos';
const Stack = createNativeStackNavigator<ServicosNaoAutorizadosStackParamList>();

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

export default function ServicosNaoAutorizadosNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }): NativeStackNavigationOptions => ({
        ...baseScreenOptions,
        headerLeft: createHeaderLeft(() => navigation.goBack()),
      })}
    >
      <Stack.Screen
        name="Buscar"
        component={BuscarServico}
        options={{ title: 'Serviços não autorizados' }}
      />
      <Stack.Screen
        name="ResultadoServicos"
        component={ResultadoServicos}
        options={{ title: 'Resultado da Consulta' }}
      />
      <Stack.Screen name="Consultar" component={ConsultarPrestador} options={{ title: 'Consultar' }} />
      <Stack.Screen
        name="ListaPrestadores"
        component={ListaPrestadores}
        options={{ title: 'Resultado da Consulta' }}
      />
      <Stack.Screen
        name="CadastrarPrestador"
        component={CadastrarPrestador}
        options={{ title: 'Cadastrar Prestador de Serviço' }}
      />
      <Stack.Screen name="AreaAtuacao" component={AreaAtuacao} options={{ title: 'Serviço' }} />
      <Stack.Screen name="AreaPortuaria" component={AreaPortuaria} options={{ title: 'Área Portuária' }} />
      <Stack.Screen
        name="NavegacaoInterior"
        component={NavegacaoInterior}
        options={{ title: 'Navegação Interior' }}
      />
      <Stack.Screen name="Instalacao" component={Instalacao} options={{ title: 'Instalação' }} />
      <Stack.Screen name="Equipe" component={Equipe} options={{ title: 'Equipe' }} />
      <Stack.Screen
        name="DescricaoFiscalizacao"
        component={DescricaoFiscalizacao}
        options={{ title: 'Descrição' }}
      />
      <Stack.Screen
        name="Irregularidades"
        component={Irregularidades}
        options={{ title: 'Irregularidades' }}
      />
      <Stack.Screen
        name="ResultadoFiscalizacao"
        component={ResultadoFiscalizacao}
        options={{ title: 'Resumo' }}
      />
      <Stack.Screen name="AutoEmitido" component={AutoEmitido} options={{ title: 'Auto de Infração' }} />
      <Stack.Screen
        name="ProcessoFiscalizacao"
        component={ProcessoFiscalizacao}
        options={{ title: 'Processo' }}
      />
      <Stack.Screen
        name="ReenviarDocumentos"
        component={ReenviarDocumentos}
        options={{ title: 'Reenviar Documentos' }}
      />
    </Stack.Navigator>
  );
}
