import React from "react";
import { Container, Spinner, Text, Icon } from "native-base";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Dimensions, StyleSheet, TouchableOpacity, Image } from "react-native";

const window = Dimensions.get("window");

class ScannerScreen extends React.Component {
  static navigationOptions = {
    title: "Escanear código de barras",
  };
  // Component State
  state = {
    hasCameraPermission: null, // if app has permissions to acess camera
    isScanned: false, // scanned
  };
  async componentDidMount() {
    // ask for camera permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    console.log(status);
    this.setState({ hasCameraPermission: status === "granted" ? true : false });
  }

  handleBarCodeScanned = ({ type, data }) => {
    //enviar a busqueda
    this.props.navigation.navigate("Busqueda", {
      data: data,
    });
    //alert(`Tipo ${type} datos ${data} !`);
  };

  render() {
    const { hasCameraPermission, isScanned } = this.state;
    if (hasCameraPermission === null) {
      // requesting permission
      return <Spinner />;
    }
    if (hasCameraPermission === false) {
      //permission denied
      return (
        <Container>
          <Text>Por favor proporcione permisos a la cámara</Text>
        </Container>
      );
    }
    if (
      hasCameraPermission === true &&
      !isScanned &&
      this.props.navigation.isFocused()
    ) {
      // we have permission and this screen is under focus
      return (
        <Container
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ed6d2d",
          }}
        >
          <Text style={{ color: "#fff", padding: 10 }}>
            ENFOQUE EL CÓDIGO EN EL CENTRO
          </Text>
          <BarCodeScanner
            onBarCodeScanned={isScanned ? undefined : this.handleBarCodeScanned}
            style={{
              height: window.height / 1.4,
              width: window.height,
              borderRadius: 10,
            }}
          ></BarCodeScanner>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Busquedamanual")}
            style={styles.fab}
          >
            <Image
              source={require("../assets/icons/deslizador.png")}
              resizeMode="cover"
              style={{
                borderRadius: 25,
                height: 50,
                width: 50,
              }}
            />
          </TouchableOpacity>
        </Container>
      );
    } else {
      return <Spinner />;
    }
  }
}
const styles = StyleSheet.create({
  fab: {
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
});

export default ScannerScreen;
