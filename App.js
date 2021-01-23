import React from "react";
import Setup from "./src/boot/setup";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist"; // NO BORRAR

import { store, persistor } from "./src/reduxConfig/store";

export default class App extends React.Component {
  componentDidMount = () => {
    // persistStore(); // Sirve para borrar datos persistentes
    //   // logout(); // Cerrar sesión de firebase
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={false}>
          <Setup />
        </PersistGate>
      </Provider>
    );
  }
}
