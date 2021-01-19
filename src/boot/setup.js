import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import React, { Component } from "react";
import { StyleProvider } from "native-base";

import App from "../app";
import getTheme from "../theme/components";
import variables from "../theme/variables/commonColor";

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }
  componentDidMount() {
    this.loadFonts();
  }
  async loadFonts() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      'Roboto': require('../assets/fonts/roboto-regular.ttf'),

    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      ); }

      return (
        <StyleProvider style={getTheme(variables)}>
          <App />
        </StyleProvider>
      );
  }

  async _cacheResourcesAsync() {
    const images = [require('../../assets/icon.png')];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    }); 
    return Promise.all(cacheImages);
  }

}