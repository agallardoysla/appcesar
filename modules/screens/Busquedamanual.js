import React, { Component, useState, useEffect } from "react";
import {StyleSheet, View, ScrollView, Text, TouchableOpacity, ActivityIndicator, SafeAreaView, FlatList, TouchableWithoutFeedback, Image} from 'react-native';
import {Icon, Form, Item, Label, Input, Content, Button} from 'native-base';


class Busquedamanual extends Component{
  static navigationOptions = {
    title: 'Búsqueda manual',
  };

  state = {
    isLoading: true,
    dataSource: [],
    term : '',
  };

  componentDidMount() {
    this.setState({
        isLoading: false,
    });
  }

  fetchBusquedaManual = () => {
    const term = this.state.term
    //alert(term);
    fetch(`https://nelbermec.com/api/busquedaCodigo/${term}`)
      .then(response => response.json())
      .then(responseJson => {
        if(responseJson.result == false){
          alert(response.message);
          this.props.navigation.navigate('ScannerScreen');
        }else{
          this.setState({
            dataSource: responseJson,
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
      <TouchableWithoutFeedback onPress={() => this.handleAsignaciones(item.asignacion_id)}>
          <View style={styles.card}>
            <Text style={styles.cliente}>{item.cliente_razon_social}</Text>
            <Text style={styles.direcciones}>Factura: {item.matriz_codigo_factura}</Text>
            <Text style={styles.direcciones}>Contacto: {item.cliente_telefono1}</Text>
          </View>
      </TouchableWithoutFeedback>
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
            <Form style={{backgroundColor:'#fff'}}>
              <Item floatingLabel>
                <Input keyboardType='numeric' placeholder='Ingrese el código' onChangeText={term => this.setState({term})}/>
              </Item>
              <TouchableOpacity onPress={this.fetchBusquedaManual} style={{padding:10, flexDirection:'row', alignContent:'center',justifyContent: 'center'}}>
                <Image
                  source={require("../assets/icons/deslizador.png")}
                  resizeMode="cover"
                  style={{
                    borderRadius: 10,
                    height: 60,
                    width: 60,
                  }}
                />
              </TouchableOpacity>
            </Form>
          <ScrollView>
            <FlatList
              data={dataSource}
              renderItem={this.renderItem}
              keyExtractor={this._keyExtractor}
            />
          </ScrollView>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ScannerScreen')} style={styles.fab}>
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
        </SafeAreaView>
    );
  }
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ed6d2d"
  },

  cliente: {
    fontSize: 18,
  },

  card: {
    flex: 0.5,
    backgroundColor: "#fff",
    marginVertical: 6,
    borderWidth: 0,
    marginBottom: 5,
    marginHorizontal: '3%',
    borderRadius: 10,
    padding: 5
  },

  direcciones: {
    fontSize: 14,
  },
  fab: {
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
  fabIcon: {
    fontSize: 40,
    color: 'white'
  }


});

export default Busquedamanual;
