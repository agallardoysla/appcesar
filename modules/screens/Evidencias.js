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
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Textarea, Form, Item, Label, Input, Content, Picker } from 'native-base';

import * as axios from 'axios';
import qs from 'qs';

const screenWidth = Math.round(Dimensions.get('window').width);

class Evidencias extends React.Component {
  static navigationOptions = {
    title: 'Respaldos adicionales',
  };

  state = {
    image: null,
    images: '',
    LocalImage: [],
    image_name: '',
    image_url: '',
    multipleUrl: [],
    // primarys
    dataSource: [],
    comentario: '',
    dataEstados: [],
    estado: '',
    latitude: '',
    longitude: '',
    idAsignacion: '',
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

  getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
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
        allowsEditing: true,
        aspect: [4, 3],
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
      }
    }
  };

  _pickImage = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
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
        this.setState({
          dataSource: responseJson,
          isLoading: false,
          idAsignacion: enlace,
        });
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
    console.log(this.state.LocalImage, this.state.latitude, this.state.longitude, this.state.idAsignacion, this.state.estado, this.state.comentario);
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
      })
      .catch((err) => {
        alert(err);
        console.log(err)
      })
  };

  renderItem = ({ item }) => (
    <TouchableWithoutFeedback>
      <View style={styles.card}>
        <Text style={styles.cliente}>{item.cliente_razon_social}</Text>
        <Text style={styles.direcciones}>Factura: {item.matriz_codigo_factura}</Text>
        <Text style={styles.direcciones}>Contacto: {item.cliente_telefono1}</Text>
        <Text style={styles.direcciones}>Fecha despacho: {item.matriz_fecha_despacho}</Text>
        <Text style={styles.cliente}>CAJAS: {item.matriz_cajas}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

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
      images.push(<Image key={index} source={{ uri: item }} style={{ width: 100, height: 100 }} />);
    });
    return images;
  }

  render() {
    const { dataSource } = this.state;
    if (this.state.isLoading) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
          <View style={styles.ContainerscrollArea}>
            <ScrollView style={styles.scrollArea}>
              <FlatList
                data={dataSource}
                renderItem={this.renderItem}
                keyExtractor={this._keyExtractor}
              />
            </ScrollView>
            </View>
        <Item>
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
        
        <View style={{ flexDirection: 'row', margin: 10 }}>
          <Button color="#ed6d2d" onPress={this._takePhoto} title="ABRIR CÁMARA" />
          <Button color="#ed6d2d" title="ABRIR GALERIA" onPress={this._pickImage} />
        </View>

        <View style={styles.containers}>{this._renderImages()}</View>

        <View
          style={{
            fontSize: 20,
            backgroundColor: '#ed6d2d',
            borderRadius: 0,
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
            <Text style={{ flexDirection: 'row', textAlign: 'center', color: '#fff', fontSize: 20 }}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  ContainerscrollArea: {
    height: 100,
    padding: 10,
    flexDirection: 'column',
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
