import * as React from 'react';
import {
  Button,
  Image,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import CameraRoll from "@react-native-community/cameraroll";

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Textarea, Form, Item, Label, Input, Content, Picker } from 'native-base';

import Perfil from '../components/Perfil'

class Evidencias extends React.Component {
  static navigationOptions = {
    title: 'Registrar entrega',
  };

  state = {
    isLoading: true,
    image: null,
    images: '',
    LocalImage: [],
    image_name: '',
    image_url: '',
    multipleUrl: [],
    // primarys
    dataSource: '',
    comentario: '',
    dataEstados: [],
    estado: '',
    latitude: '',
    longitude: '',
    idAsignacion: '',
    //perfil
    nombre : '',
    cedula: '',
    factura:'',
    telefono:'',
    cajas:'',
  };

  async componentDidMount() {
    // this.getPermissionAsync();
    this.fetchEnlace();
    this.fetchEstados();
    // requerir localizacion
    try {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    } catch (error) {
      console.log(error);
    }
  }

  async hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }else{
      alert('Lo sentimos, necesitamos permisos de cámara para que esto funcione!');
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Lo sentimos, necesitamos permisos de cámara para que esto funcione!');
      }
    }
  };

  _takePhoto = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);
    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      const pickerResult = await ImagePicker.launchCameraAsync({
        base64: true,
        allowsEditing: false,
        aspect: [2, 3],
        quality: 0.5
      });

      if (!pickerResult.cancelled) {
        const imageUri = pickerResult ? `data:image/jpg;base64,${pickerResult.base64}` : null;
        // this.state.multipleUrl.push(imageUri);
        this.setState({
          multipleUrl: this.state.multipleUrl.concat([imageUri]),
        });

        this.setState({
          LocalImage: this.state.LocalImage.concat([pickerResult.uri]),
        });
        CameraRoll.saveToCameraRoll(this.state.LocalImage);
      }
    }
  };

  _pickImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: false,
      aspect: [2, 3],
      quality: 0.5
    });
    const imageUri = pickerResult ? `data:image/jpg;base64,${pickerResult.base64}` : null;
    // imageUri && { uri: imageUri };
    // this.state.multipleUrl.push(imageUri);
    // this.state.LocalImage.push(pickerResult.uri)
    this.setState({
      multipleUrl: this.state.multipleUrl.concat([imageUri]),
    });

    this.setState({
      LocalImage: this.state.LocalImage.concat([pickerResult.uri]),
    });
  };

  // extraer datos de la asignacion
  fetchEnlace = () => {
    const { navigation } = this.props;
    const enlace = navigation.getParam('id');
    // alert(term);
    fetch(`https://nelbermec.com/api/busquedaEnlace/${enlace}`)
      .then(response => response.json())
      .then(responseJson => {
        if(responseJson.result = false){
          alert('Este pedido ya fue marcado como entregado!');
          this.props.navigation.navigate('Zonas');
        }else{
          this.setState({
            nombre:responseJson[0].cliente_razon_social,
            cedula: responseJson[0].cliente_documento,
            factura:responseJson[0].matriz_codigo_factura,
            telefono:responseJson[0].cliente_telefono1,
            cajas:responseJson[0].matriz_cajas,
            isLoading: false,
            idAsignacion: enlace,
          });
          console.log(responseJson);
          console.log(responseJson[0].cliente_razon_social);
        }
      });
  };

  // lista de estados
  fetchEstados = () => {
    // alert(term);
    fetch(`https://nelbermec.com/api/getEstados`)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataEstados: responseJson,
        });
      });
  };

  //enviar al servidor
  sendDataToserver = () => {
    console.log(this.state.latitude, this.state.longitude);
    if(this.state.LocalImage.length === 0){
      alert('Es necesario cargar un archivo ');
    }else if (this.state.estado == 1){
      alert('No puede seleccionar el estado EN RUTA');
    }else if (this.state.latitude == ''){
      alert('Debe activar el GPS, no se puede obtener la localización!');
      this.props.navigation.navigate('Asignaciones');
    }else{
      //loading
        this.setState({
          isLoading: true,
        });
      //      
      // create formData object
      const formData = new FormData();

      //ad to data
      this.state.LocalImage.forEach((item, i) => {
        formData.append("userfile[]", {
          uri: item,
          type: "image/jpeg",
          name: item.filename || `filename${i}.jpg`,
        });
      });
      //formData.append('userfile[]', images);
      formData.append('estado', this.state.estado);
      formData.append('latitude', this.state.latitude);
      formData.append('longitude', this.state.longitude);
      formData.append('idAsignacion', this.state.idAsignacion);
      formData.append('comentario', this.state.comentario);

      console.log(formData);

      fetch('https://nelbermec.com/api/registrarEntrega', {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data"
        },
        body: formData
      }).then(response => response.json())
      .then(responseJson => {
          if(responseJson.result == true){
            alert(responseJson.message);
            console.log(responseJson);
            this.props.navigation.navigate('Zonas');
          }else{
            alert(responseJson.message);
          }
          this.setState({
            isLoading: false,
          });        
        })
        .catch((err) => {
          alert(err);
          console.log(err);
          this.setState({
            isLoading: false,
          });
        })
    }
  };

  _maybeRenderImage = () => {
    const { image } = this.state;

    if (!image) {
    }
  };

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      );
    }
  };

  _renderImages() {
    const images = [];
    this.state.LocalImage.map((item, index) => {
      images.push(
      <Image 
        key={index} 
        source={{ uri: item }} 
        style={{borderRadius:6, borderColor:"#ed6d2d",borderWidth: 1, borderStyle: 'solid', width: 150, height: 150 }} 
      />);
    });
    return images;
  }

  render() {
    const {nombre, cedula, factura, cajas, telefono } = this.state;
    if (this.state.isLoading) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#ed6d2d" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, alignItems: 'center',  backgroundColor: '#fff' }}>

            <Perfil nombre={nombre} cedula={cedula} factura={factura} cajas={cajas} telefono={telefono}/>
        <Item style={{margin:20}}>
          <Input
            placeholder="Escriba un comentario para esta entrega"
            onChangeText={comentario => this.setState({ comentario })}
          />
        </Item>
        <Item>
          <Text style={{ fontSize: 20 }}>Seleccione un estado</Text>
        </Item>
        <Item style={{ marginBottom: 20 }}>
          <Picker
            selectedValue={this.state.estado}
            onValueChange={(itemValue, itemIndex) => this.setState({ estado: itemValue })}
          >
            {this.state.dataEstados.map((item, key) => (
              <Picker.Item label={item.estado_descripcion} value={item.estado_id} key={key} />
            ))}
          </Picker>
        </Item>
        
        <View style={{flexDirection: 'row', margin: 6}}>
          <Button color="#ed6d2d" onPress={this._takePhoto} title="ABRIR CÁMARA" />
          <Button color="#ed6d2d" title="ABRIR GALERIA" onPress={this._pickImage} />
        </View>

        <View style={styles.containers}>{this._renderImages()}</View>

        <View
          style={{
            fontSize: 20,
            backgroundColor: '#ed6d2d',
            borderTopLeftRadius:15,
            borderTopRightRadius:15,
            color: '#fff',
            width: '100%',
            paddingTop: 12,
            paddingBottom: 12,
            textAlign: 'center',
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        >
          <TouchableOpacity onPress={this.sendDataToserver}>
            <Text 
              style={{ flexDirection: 'row', textAlign: 'center', color: '#fff', fontSize: 20, borderRadius:10 }}
              >Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  scrollArea: {
    height: 10,
    width: '100%'
  },
  card: {
    flex:1,
    backgroundColor: "#ed6d2d",
    marginVertical: 6,
    borderWidth: 0,
    marginBottom: 5,
    marginHorizontal: '3%',
    borderRadius: 10,
    padding: 5
  },

  cliente: {
    fontSize: 18,
  },

  direcciones: {
    fontSize: 14,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },

  containers: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  nav_icon: {
    marginTop: 10,
    marginBottom: 5,
  },
  headingtext: {
    textAlign: 'left',
    color: '#ffffff',
    fontSize: 20,
  },
  category_text_col: {
    fontSize: 18,
    color: '#ffffff',
  },
  category_col: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
  },
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
});

export default Evidencias;
