import React, { Component } from "react";
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

import {Icon } from 'native-base';

class Zonas extends Component{
  static navigationOptions = {
    title: "Zonas asignadas",
  };

  state = {
    isLoading: true,
    dataSource: [],
    usuario : 0
  };
  
  LogoutUser = () => {
    AsyncStorage.removeItem('userData');
    this.props.navigation.navigate('Auth');
    }

  async componentDidMount() {
    
    let userData = await AsyncStorage.getItem("userData");
    let data = JSON.parse(userData);
    //alert(data);
    fetch(`https://nelbermec.com/api/zonas_get/${data}`)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        });
      });
  }

  handleZonas = id => {
    this.props.navigation.navigate('Asignaciones', {
      id,
    });
  };



  renderZona = ({ item }) => (
      <TouchableOpacity onPress={() => this.handleZonas(item.zona_id)}>
            <View style={styles.mainCardView}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                <View style={{marginLeft: 12}}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#131313',
                      fontWeight: 'bold',
                      //fontFamily: Fonts.nunitoBold,
                      textTransform: 'capitalize',
                    }}>
                    {'Zona '+item.zona_nombre}
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
                      {'Estado de las entregas'}
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
                <Text style={{color: '#fff'}}>
                  {item.entregas}
                </Text>
              </View>
              <View
                style={{
                  height: 35,
                  backgroundColor: '#D56868',
                  borderWidth: 0,
                  width: 35,
                  marginLeft: -26,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 70,
                }}>
                <Text style={{color: '#fff'}}>
                  {item.total - item.entregas}
                </Text>
              </View>
            </View>
      </TouchableOpacity>
  );

  _keyExtractor = item => item.zona_id;

  render() {
    const { dataSource , isLoading } = this.state;
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
            <FlatList
              data={dataSource}
              renderItem={this.renderZona}
              keyExtractor={this._keyExtractor}
            />
          </ScrollView>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ScannerScreen')} style={styles.fabCode}>
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
          <TouchableOpacity onPress={() => this.LogoutUser()} style={styles.fabLogout}>
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
    backgroundColor: "#ed6d2d"
  },
  mainCardView: {
    height: 90,
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
  subCardView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    //backgroundColor: '#625F5F',
    borderColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabCode: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 8
  },
  fabLogout: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    left: 20,
    bottom: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 8
  },
  fabIcon: {
    fontSize: 40,
    color: 'white'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  
});

export default Zonas;
