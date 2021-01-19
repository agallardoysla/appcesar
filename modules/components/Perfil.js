import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Fonts,
} from "react-native";

function Perfil (props){

    console.log(props.nombre);
      return (
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
                {props.nombre}
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
                  {'CED: '+props.cedula}
                </Text>
                <Text
                  style={{
                    color: '#666464',
                    fontSize: 12,
                    fontWeight: "bold"
                  }}>
                  {'Factura: '+props.factura}
                </Text>
                <Text
                  style={{
                    color: '#666464',
                    fontSize: 12,
                    fontWeight: "bold"
                  }}>
                  {'Telefono: '+props.telefono}
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
              {props.cajas}
            </Text>
          </View>
        </View>
      )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ed6d2d"
  },
  mainCardView: {
    height: 120,
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

export default Perfil;
