import React, { Component } from "react";
import { BackHandler } from "react-native";
import { Alert } from "react-native";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
  StatusBar,
  AsyncStorage,
  TouchableOpacity,
  Platform,
  Image,
  Fonts,
} from "react-native";

import { connect } from "react-redux";
import { actions } from "../../src/reduxConfig";

class Zonas extends Component {
  static navigationOptions = {
    title: "Zonas asignadas",
  };

  state = {
    isLoading: true,
    dataSource: [],
    usuario: 0,
  };

  dispatch = this.props.dispatch;

  sincronizarData = () => {
    this.setState({
      isLoading: true,
    });

    if (this.props.entrega.entrega.length == 0) {
      this.setState({ isLoading: false });
      alert("Realice una entrega");
    }

    this.props.entrega.entrega.map(async (e, index) => {
      let formData = await this.createFormData(e);
      // console.log("entrega:", e);
      let isthend = this.props.entrega.entrega.length == index + 1;
      let result = await this.sendFetch(formData, isthend);
      // console.log("isthend:", isthend);

      result && isthend && this.props.dispatch(actions.actualizarEntrega([]));
      result && isthend && this.props.navigation.push("AllData");
      isthend && this.setState({ isLoading: false });
    });
  };

  createFormData = async (objeto) => {
    const formData = new FormData();

    //ad to data
    await objeto.LocalImage.map(async (item, i) => {
      console.log("OBJETO:", objeto.LocalImage);
      formData.append("userfile[]", {
        uri: item,
        type: "image/jpeg",
        name: item.split("/").pop(),
      });
    });
    // formData.append("userfile[]", images);
    formData.append("estado", objeto.estado);
    formData.append("latitude", objeto.latitude);
    formData.append("longitude", objeto.longitude);
    formData.append("idAsignacion", objeto.idAsignacion);
    formData.append("comentario", objeto.comentario);

    return formData;
  };

  sendFetch = async (formData, isthend = false) => {
    return await fetch("https://nelbermec.com/api/registrarEntrega", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.result == true) {
          isthend && alert(responseJson.message);
          // console.log(responseJson);
        } else {
          isthend && alert(responseJson.message);
        }
        // this.setState({
        //   isLoading: false,
        // });
        // console.log("reponse:", responseJson);
        return true;
      })
      .catch((err) => {
        alert(err);
        // console.log(err);
        // this.setState({
        //   isLoading: false,
        // });
        return false;
      });
  };

  LogoutUser = () => {
    AsyncStorage.removeItem("userData");
    this.dispatch(actions.actualizarLogin()); // logout
    this.dispatch(actions.actualizarZonas()); // limpiar zonas
    this.props.navigation.navigate("Auth");
  };

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backAction);

    // let userData = await AsyncStorage.getItem("userData");
    // let data = JSON.parse(userData);
    // //alert(data);
    // fetch(`https://nelbermec.com/api/zonas_get/${data}`)
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     this.setState({
    //       isLoading: false,
    //       dataSource: responseJson,
    //     });
    //   });
    if (this.props.zonas.zonas !== undefined) {
      this.setState({
        isLoading: false,
      });
    }
  }

  handleZonas = (id) => {
    this.props.navigation.push("Asignaciones", {
      id,
    });
  };

  renderZona = ({ item }) => {
    let asig = this.props.asignaciones.asignaciones.find(
      (a) => a.zona_id == item.zona_id
    );
    // console.log(asig.asignaciones.length);
    console.log("ENTREGA:", this.props.entrega.entrega);

    return (
      <TouchableOpacity onPress={() => this.handleZonas(item.zona_id)}>
        <View style={styles.mainCardView}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.subCardView}>
              <Image
                source={require("../assets/icons/ubicacion.png")}
                resizeMode="cover"
                style={{
                  borderRadius: 25,
                  height: 50,
                  width: 50,
                }}
              />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 18,
                  color: "#131313",
                  fontWeight: "bold",
                  //fontFamily: Fonts.nunitoBold,
                  textTransform: "capitalize",
                }}
              >
                {"Zona " + item.zona_nombre}
              </Text>
              <View
                style={{
                  marginTop: 4,
                  borderWidth: 0,
                  width: "85%",
                }}
              >
                <Text
                  style={{
                    color: "#666464",
                    fontSize: 12,
                  }}
                >
                  {"Estado de las entregas"}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              height: 35,
              backgroundColor: "#09CC47",
              borderWidth: 0,
              width: 35,
              marginLeft: -5,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 70,
            }}
          >
            <Text style={{ color: "#fff" }}>{item.entregas}</Text>
          </View>
          <View
            style={{
              height: 35,
              backgroundColor: "#D56868",
              borderWidth: 0,
              width: 35,
              marginLeft: -26,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 70,
            }}
          >
            <Text style={{ color: "#fff" }}>{asig.asignaciones.length}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _keyExtractor = (item) => item.zona_id;

  backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }

  render() {
    // const { dataSource, isLoading } = this.state;s
    // console.log("dataSource:", dataSource);
    // console.log("isLoading:", isLoading);

    if (this.state.isLoading) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <TouchableOpacity
            style={styles.sincronizarTouchable}
            onPress={() => this.sincronizarData()}
          >
            <Text>Sincronizar</Text>
          </TouchableOpacity>
          <FlatList
            data={this.props.zonas.zonas}
            renderItem={this.renderZona}
            keyExtractor={this._keyExtractor}
          />
        </ScrollView>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("ScannerScreen")}
          style={styles.fabCode}
        >
          <Image
            source={require("../assets/icons/barcode.png")}
            resizeMode="cover"
            style={{
              borderRadius: 25,
              height: 50,
              width: 50,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.LogoutUser()}
          style={styles.fabLogout}
        >
          <Image
            source={require("../assets/icons/salida-de-emergencia.png")}
            resizeMode="cover"
            style={{
              borderRadius: 25,
              height: 50,
              width: 50,
            }}
          />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ed6d2d",
  },

  sincronizarTouchable: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 8,
    marginHorizontal: "25%",
    marginTop: "1.5%",
    shadowColor: "#2C2B2B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    width: "50%",
  },

  mainCardView: {
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#2C2B2B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 16,
  },
  subCardView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    //backgroundColor: '#625F5F',
    borderColor: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
  },

  fabCode: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    elevation: 8,
  },
  fabLogout: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    left: 20,
    bottom: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 40,
    color: "white",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

const mapStateToProps = ({ zonas, login, entrega, asignaciones }) => ({
  zonas,
  login,
  entrega,
  asignaciones,
});

export default connect(mapStateToProps)(Zonas);
