import React from 'react';
import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppLoading } from 'expo';
import { useFonts, Archivo_400Regular, Archivo_700Bold } from '@expo-google-fonts/archivo';
import DatabaseInit from './src/database/database-init';
// import DatabaseDestroy from './src/database/database-destroy';

import AppStack from './src/routes/AppStack';

const App = () => {
  new DatabaseInit();
  // new DatabaseDestroy();
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_700Bold
  });

  if(!fontsLoaded) {
    return <AppLoading />
  } else {
    return (
      <>
        <SafeAreaView style={styles.container}>
          <AppStack />
          <StatusBar style="auto" />
        </SafeAreaView>
      </>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1 , 
    paddingTop: Platform.OS === 'android' ? 28 : 0,
    backgroundColor: '#fff',
  }
 });


