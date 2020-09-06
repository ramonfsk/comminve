import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface PageHeaderProps {
  title: string;
  defaultBack: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, defaultBack=true }) => {
  const { navigate } = useNavigation();

  function handleGoBack() {
    if (defaultBack) {
      navigate('Home');
    } else {
      navigate('Contracts');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <BorderlessButton onPress={handleGoBack}>
          <MaterialIcons style={styles.iconBackButton} name="arrow-back" />
        </BorderlessButton>
        <Text style={styles.textTitleNavbar}>{title}</Text>
      </View>
  </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create({ 
  container: {
    //flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 16,
    backgroundColor: '#8257e5',
    borderBottomWidth: 2.6,
    borderBottomColor: '#000'
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  iconBackButton: {
    fontSize: 34,
  },
  textTitleNavbar: {
    fontFamily: 'Archivo_700Bold',
    fontSize: 22
  }
});