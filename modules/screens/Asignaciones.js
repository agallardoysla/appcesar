import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  Image
} from "react-native";

class Asignaciones extends Component{

  static navigationOptions = {
    title: 'Entregas pendientes',
  };

  state = {
    isLoading: true,
    dataSource: [],
    usuario : 0,
    pendientes:0
  };

  // async getToken(user) {
  //   try {
  //     let userData = await AsyncStorage.getItem("userData");
  //     let data = JSON.parse(userData);
  //     //this.setState({usuario: data});
  //     return JSON.parse(data);
  //   } catch (error) {
  //     console.log("Error al extraer el token", error);
  //   }
  // }


  async componentDidMount() {
    
    let userData = await AsyncStorage.getItem("userData");
    let data = JSON.parse(userData);
    this.setState({
      usuario:data,
    });
    this.fetchEntregas();
  }

  fetchEntregas = () => {
    const { navigation } = this.props;
    const zona = navigation.getParam('id');
    const usuario = this.state.usuario
    console.log(usuario);
    console.log(zona);
    fetch(`https://nelbermec.com/api/asignacionesPorZonas/${zona}/${usuario}`)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          dataSource: responseJson,
          pendientes: responseJson.length,
        });
        console.log(responseJson);
      });
  };

  handleAsignaciones = id => {
    this.props.navigation.navigate('Entrega', {
      id,
    });
  };


  renderZona = ({ item }) => (
      <TouchableOpacity onPress={() => this.handleAsignaciones(item.asignacion_id)}>
        <View style={styles.mainCardView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.subCardView}>
              <Image
                source={require("../assets/icons/man.png")}
                resizeMode="cover"
                style={{
                  borderRadius: 25,
                  height: 50,
                  width: 50,
                }}
              />
            </View>
            <View style={{flex: 0.9, marginLeft: 12}}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#131313',
                  fontWeight: 'bold',
                  //fontFamily: Fonts.nunitoBold,
                  textTransform: 'capitalize',
                  flexShrink:1,
                }}>
                {item.cliente_razon_social.replace(/\s\s+/g, ' ')}
              </Text>
              <View
                style={{
                  marginTop: 4,
                  borderWidth: 0,
                  width: '85%',
                }}>
                <Text
                  style={{
                    color: '#666464',
                    fontSize: 12,
                  }}>
                  {item.cliente_direccion}
                </Text>
                <Text
                  style={{
                    color: '#666464',
                    fontSize: 12,
                    fontWeight: "bold"
                  }}>
                  {'Factura: '+item.matriz_codigo_factura}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              height: 35,
              backgroundColor: '#09CC47',
              borderWidth: 0,
              width: 35,
              marginLeft: -5,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 70,
            }}>
            <Text style={{color: '#fff', fontSize:16}}>
              {'+'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
  );

  keyExtractor = item => item.asignacion_id;

  render() {
    const { dataSource , isLoading, pendientes } = this.state;
    if (this.state.isLoading) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
          <Text style={styles.cardTitle}>
              Pendientes por entregar {pendientes}
          </Text>
          <ScrollView>
            <FlatList
              data={dataSource}
              renderItem={this.renderZona}
              keyExtractor={this.keyExtractor}
            />
          </ScrollView>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#ed6d2d"

  },
  mainCardView: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#2C2B2B',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 14,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 16,
    marginRight: 16,
  },

  cardTitle: {
    flexWrap: 'wrap',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: "#fff",
    fontSize: 18,
    padding:10,
    backgroundColor: '#38403B',
    borderRadius:10,
    color: 'white',
    marginTop:10,
    marginLeft:16,
    marginRight:16,
    marginBottom:3,
  },

  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default Asignaciones;
