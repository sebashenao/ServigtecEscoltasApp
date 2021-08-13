import 'react-native-gesture-handler'
import React from 'react'
import DrawerNavigator from './src/navigation/DrawerNavigator';
import RootStackScreen from './src/screens/RootStackScreen';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from './src/components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {

  // adb -s 41118f23 reverse tcp:8081 tcp:8081

  const initialLoginState = {
    isLoading: false,
    userName: null,
    userToken: null,
  };

  const [user, setUser] = React.useState({
    apellidos: '',
    celular: '',
    documento: '',
    email: '',
    escolta_id: '',
    estado: '',
    id: '',
    nombres: '',
    perfil_id: ''
  })

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  React.useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  const authContext = React.useMemo(() => ({
    signIn: async (dataUser) => {
      const userToken = dataUser.response.access_token;
      const userName = `${dataUser.response.nombres} ${dataUser.response.apellidos}`;

      try {
        await AsyncStorage.setItem('userToken', JSON.stringify(dataUser.response));
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGIN', id: userName, token: userToken });
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
  }), []);

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const config = loginState.userToken !== null ? (<DrawerNavigator />) : <RootStackScreen />

  return (
    <AuthContext.Provider value={authContext}>
      {config}
    </AuthContext.Provider>
  )
}

export default App;