import React, { Component, useState, useEffect } from "react";
import {StyleSheet, View, ScrollView, Text, Dimensions, ActivityIndicator, SafeAreaView, FlatList, Image, TouchableOpacity} from 'react-native';
import {Icon, Item, Label, Input, Content, Button, Thumbnail} from 'native-base';

import MaterialButtonPrimary from "../components/MaterialButtonPrimary";
import MaterialButtonDanger from "../components/MaterialButtonDanger";

const window = Dimensions.get('window');

class Busqueda extends Component{
  static navigationOptions = {
    title: 'Resultados',
  };

  state = {
    isLoading: true,
    dataSource: [],
  };

  componentDidMount() {
    this.fetchBusquedaBarcode();
  }

  fetchBusquedaBarcode = () => {
    const { navigation } = this.props;
    const data = navigation.getParam('data');
    //alert(term);
    fetch(`https://nelbermec.com/api/busquedaCodigo/${data}`)
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if(responseJson.result == false){
          alert(responseJson.message);
          this.props.navigation.navigate('ScannerScreen');
        }else{
          this.setState({
            dataSource: responseJson,
            isLoading:false,
          });
        }
        
      });
  }

  handleAsignaciones = id => {
    this.props.navigation.navigate('Entrega', {
      id,
    });
  };
  

  renderItem = ({ item }) => (
      // <TouchableWithoutFeedback onPress={() => this.handleAsignaciones(item.asignacion_id)}>
      //     <View style={styles.rect}>
      //         <Image
      //         source={require("../../assets/cliente.png")}
      //         resizeMode="contain"
      //         style={styles.image}
      //       ></Image>
      //       <Text style={styles.cliente}>{item.cliente_razon_social}</Text>
      //       <Text style={styles.factura}>Factura: {item.matriz_codigo_factura}</Text>
      //       <Text style={styles.factura}>Contacto: {item.cliente_telefono1}</Text>
      //       <Content>            
      //         <Button block success style={{margin:10}} onPress={() => this.handleAsignaciones(item.asignacion_id)}>
      //           <Text>CONFIRMAR</Text>
      //         </Button>
      //       </Content>
      //     </View>
      // </TouchableWithoutFeedback>
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
              <Text
                style={{
                  color: '#666464',
                  fontSize: 12,
                  fontWeight: "bold"
                }}>
                {'Teléfono: '+item.cliente_telefono1}
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
          <Text style={{color: '#fff', fontSize:30}}>
            {'+'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  _keyExtractor = item => item.asignacion_id;

  render() {
    const { dataSource} = this.state;
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
              renderItem={this.renderItem}
              keyExtractor={this._keyExtractor}
            />
          </ScrollView>
          <Button block style={{margin:20, backgroundColor:'#FFF', borderRadius:10}} onPress={() => this.props.navigation.navigate('ScannerScreen')}>
            <Text style={{fontSize:20}}>ESCANEAR DE NUEVO</Text>
          </Button>
        </SafeAreaView>
    );
  }
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ed6d2d",
  },
  mainCardView: {
    height: 150,
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
  rect: {
    margin:4,
    backgroundColor: "rgba(245,245,245,1)",
    borderRadius: 4,
    padding:10
  },
  image: {
    flex:1,
    flexDirection: "column",
    width: 100,
    height: 100,
    marginTop: 25,
    marginLeft: 103
  },
  nombre: {
    color: "#121212",
    marginTop: 23,
    marginLeft: 26,
    marginRight:26,
  },
  factura: {
    color: "#121212",
    marginTop: 13,
    marginLeft: 86,
  },
  contacto: {
    color: "#121212",
    marginTop: 9,
    marginLeft: 124
  },
  btnConfirmar: {
    flex:1,
    height: 36,
    width: 131,
      paddingBottom:10
  },
  btnEscanear: {
    flex:1,
    width: 126,
    marginLeft: 17,
    paddingBottom:10
  },
  btnConfirmarRow: {
    height: 36,
    flexDirection: "row",
    marginTop: 27,
    marginLeft: 15,
    marginRight: 15,
  }
});

export default Busqueda;
