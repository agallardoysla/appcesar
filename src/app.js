import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Login from "../modules/screens/Login";
import Zonas from "../modules/screens/Zonas";
import Asignaciones from "../modules/screens/Asignaciones";
import Busqueda from "../modules/screens/Busqueda";
import Busquedamanual from "../modules/screens/Busquedamanual";
import Entrega from "../modules/screens/Entrega";
import Anexos from "../modules/screens/Anexos";

import ScannerScreen from "../modules/screens/ScannerScreen";
import AllData from "../modules/screens/AllData";

const AppStack = createStackNavigator({
  AllData: {
    screen: AllData,
    navigationOptions: {
      title: "Obteniendo Datos",
      headerTitleStyle: {
        width: "90%",
        textAlign: "center",
      },
    },
  },
  Zonas: {
    screen: Zonas,
    navigationOptions: {
      headerLeft: null,
      headerTitleStyle: {
        width: "90%",
        textAlign: "center",
      },
    },
  },

  Asignaciones: {
    screen: Asignaciones,
  },
  Entrega: {
    screen: Entrega,
  },
  Anexos: {
    screen: Anexos,
  },
  Busqueda: {
    screen: Busqueda,
  },
  Busquedamanual: {
    screen: Busquedamanual,
  },
  ScannerScreen: {
    screen: ScannerScreen,
  },
});

const AuthStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    },
  },
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Login: Login,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: "Login",
    }
  )
);
