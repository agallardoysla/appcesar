import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, Alert, Switch, TouchableOpacity, Modal } from 'react-native';
//El siguiente componente debe ser descargado de la página de expo
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions';

//Función que contiene el componente para seleccionar imagenes de la galería
//************************************* */
function ImagePickerChoose(props) {
  //selector imagenes
  const [image, setImage] = useState(null);
  const [photoStatus, setPhotoStatus] = useState('No se ha seleccionado ninguna imágen');
  //controla que los permisos para acceder a la galería hayan sido dados
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Lo sentimos, se necesitan permisos para acceder a la galería');
        }
      }
    })();
  }, []);
  //Selecciona una imágen de manera asincrina desde la galeria y cuando se carga
  //manda a llamar a la función parentCallBack para enviarle el uri al componente padre
  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
      setPhotoStatus('Listo, imagen localizada!')
    }
    props.parentCallBack(result)
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <Button
        title="Seleccionar imágen"
        onPress={pickImage}
      />
      <Text style={{ fontSize: 12, marginBottom: 20, color: "#888888" }}>{photoStatus}</Text>
      {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
    </View>
  );
}


//Clase principal
class Anexos extends Component {
  static navigationOptions = {
    title: 'Foto de entrega',
  };
  constructor(props) {
    super(props)
    this.state = {
      image: '',//obtiene la imagen del componente ImagePickerChoose
      enlace : 0,
      //variables camara
      switchValue: false,
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      imageuri: "",
      url: ""
    }
  }
  setImageState = (img) => {
    this.setState({
      image: img.uri
    })
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const otro = navigation.getParam('id');
    this.setState({
      enlace: otro
    })
    alert(otro);
    //componenentes autocarga
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  snap = async () => {
    if (this.camera) {
      const options = {quality: 0.5};
      let photo = await this.camera.takePictureAsync(options);
      if (photo) {
        this.setState({ imageuri: photo.uri });
      }
    }
  };


  //función para subir imagen al server, en este caso es un servidor en PHP
  uploadImage = async () => {
    let localUri = this.state.imageuri;
    let idEntrega = this.state.enlace;

    if (localUri == null || localUri == '') {
      Alert.alert('Debe seleccionar una imágen')
    }
    else {
      let filename = localUri.split('/').pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      let formData = new FormData();
      formData.append('photo', { uri: localUri, name: filename, type });
      formData.append('identificador', idEntrega);

      return await fetch('https://nelbermec.com/api/uploadImage', {
        method: 'POST',
        body: formData,
        header: {
          'Accept': 'application/json, text/plain, */*',
          'content-type': 'multipart/form-data',
        },
      }).then(res => res.json())
        .catch(error => console.error('Error', error))
        .then(response => {
          if (response.result == true) {
            Alert.alert(response.message)
            this.props.navigation.navigate('Evidencias', {idEntrega});
          }
          else {
            Alert.alert(response.message)

          }
        });
    }

  };
  // render() {
  //   return (
  //     <View style={styles.container}>
  //       {/* <Text>Subir imágen a server</Text>
  //       <ImagePickerChoose parentCallBack={this.setImageState}></ImagePickerChoose>
  //       <Button
  //         title="Subir imágen"
  //         onPress={this.uploadImage}
  //       /> */}
  //     </View>
  //   );
  // }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return (
        <View>
          <Text>No access to camera</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.switchview}>
            <Text>Abrir cámara</Text>
            <Switch
              onValueChange={value => {
                this.setState({ switchValue: value });
              }}
              value={this.state.switchValue}
              style={styles.switch}
            />
          </View>
          {this.state.switchValue ? (
            <View style={styles.cameraview}>
              {this.state.imageuri != "" ? (
                <Image
                  source={{
                    uri: this.state.imageuri
                  }}
                  style={styles.uploadedImage}
                  resizeMode="contain"
                />
              ) : (
                <Camera
                  style={styles.camera}
                  type={this.state.type}
                  ref={ref => {
                    this.camera = ref;
                  }}
                >
                  <View style={styles.camerabuttonview}>
                    <TouchableOpacity
                      style={styles.cameraButtons}
                      onPress={this.cameraChange}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          marginBottom: 10,
                          color: "white"
                        }}
                      >
                        Flip
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Camera>
              )}
            </View>
          ) : (
            <View style={styles.cameraview}>
              {this.state.url != "" ? (
                <Text>Uploaded url : {this.state.url}</Text>
              ) : null}
              <Text>Cámara apagada</Text>
            </View>
          )}
          {this.state.switchValue ? (
            <View style={styles.buttonsView}>
              {this.state.imageuri == "" ? (
                <View style={styles.captureButtonView}>
                  <TouchableOpacity
                    style={styles.cameraButtons}
                    onPress={this.snap}
                  >
                    <Text
                      style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                    >
                      Foto
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={styles.captureButtonView}>
                <TouchableOpacity
                  style={styles.cameraButtons}
                  onPress={this.uploadImage}
                >
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                  >
                    Guardar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ed6d2d",
    alignItems: 'center',
    justifyContent: 'center',
  },

  switchview: {
    marginTop: 50,
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 5
  },
  switch: {
    padding: 5
  },
  cameraview: {
    height: 400,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  camera: {
    height: "95%",
    width: "95%",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  camerabuttonview: {
    height: "100%",
    backgroundColor: "transparent"
  },
  cameraButtons: {
    borderColor: "#fff",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    margin: 5
  },
  captureButtonView: {
    height: 200
  },
  buttonsView: {
    height: 200,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center"
  },
  uploadedImage: {
    height: "90%",
    width: "90%",
    padding: 10
  }
});

export default Anexos