import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import ToastManager from 'toastify-react-native';

import AlertToast from '@/components/AlertToast';
import AppNavigator from '@/navigation/AppNavigator';
import { migrateAsync } from '@/data/gestordb/database';
import { logGestorDatabaseSnapshot } from '@/services/gestorbd';

enableScreens(true);

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0F3C52',
  },
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});

const toastConfig = {
  success: (props: any) => <AlertToast {...props} />,
  error: (props: any) => <AlertToast {...props} />,
};

function App(): React.JSX.Element {
  useEffect(() => {
    const prepareDatabase = async () => {
      try {
        await migrateAsync();
        await logGestorDatabaseSnapshot();
      } catch (error) {
        console.error('[gestorbd] falha ao preparar banco local', error);
      }
    };

    prepareDatabase();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar barStyle="light-content" backgroundColor="#0F3C52" />
          <ToastManager config={toastConfig} />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
