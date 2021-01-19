import React from "react";
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from '../modules/screens/Login';
import Zonas from '../modules/screens/Zonas';
import Asignaciones from '../modules/screens/Asignaciones';
import Busqueda from '../modules/screens/Busqueda';
import Busquedamanual from '../modules/screens/Busquedamanual';
import Entrega from '../modules/screens/Entrega';
import Anexos from '../modules/screens/Anexos';

import ScannerScreen from '../modules/screens/ScannerScreen';

const AppStack = createStackNavigator({
    Zonas : {
        screen : Zonas,
    },
    Asignaciones : {
        screen : Asignaciones,
    },
    Entrega : {
        screen : Entrega,
    },
    Anexos : {
        screen : Anexos,
    },
    Busqueda : {
        screen : Busqueda,
    },
    Busquedamanual : {
        screen : Busquedamanual,
    },
    ScannerScreen : {
        screen : ScannerScreen,
    },
});

const AuthStack = createStackNavigator({
    Login : {
        screen : Login,
        navigationOptions : {
            header: null,
        }
    },
});

export default createAppContainer(createSwitchNavigator(
  {
    Login: Login,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Login',
  }
));