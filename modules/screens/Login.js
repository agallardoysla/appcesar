import React, { Component } from "react";
import { KeyboardAvoidingView, StyleSheet, View, StatusBar, Text, Image, AsyncStorage } from "react-native";
import { Container, Button, Form, CardItem, Content, Item, Label, Input } from "native-base";

class Login extends Component{

  constructor(props) {
    super(props);
    this.state = {
      correo: '',
      clave: ''
    }
  }

  componentDidMount(){
    this.DetermineScreenNavigation()
  }

    Login  = () => {
      const {correo} = this.state;
      const {clave} = this.state;

      const URL = `https://nelbermec.com/api/Login?email=${correo}&password=${clave}`;

      fetch(URL
      ).then((respuesta)=> respuesta.json())
      .then((responseJson) => {
        if(responseJson.result == true){
          this.storeToken(responseJson.id);
          this.props.navigation.navigate('App');
        }else{
          alert(responseJson.message);
        }
      }).catch((error) => {
        alert(error(error))
      })

    }

    DetermineScreenNavigation = async () =>{
      const userToken = await AsyncStorage.getItem('userData');
      this.props.navigation.navigate(userToken ? 'App': 'Auth');
    }

  async storeToken(user) {
    try {
       await AsyncStorage.setItem("userData", JSON.stringify(user));
    } catch (error) {
      console.log("Error al almacenar el token", error);
    }
  }


  render(){
    return (
      <Container>
          <Content padder>
            <CardItem cardBody>
              <Image source={require("../../assets/icon.png")} style={{height: 230, width: null, flex: 1, margin:60}}/>
            </CardItem>
            <Form>
              <Item inlineLabel>
              <Input placeholder="Usuario" onChangeText={correo => this.setState({correo})}
              />
              </Item>
              <Item inlineLabel last>
                <Input secureTextEntry={true} placeholder="Contraseña" onChangeText={clave => this.setState({clave})}/>
              </Item>
              <Button warning style = {{padding: '30%', alignSelf: 'center'}} onPress={this.Login}>
                <Text> INGRESAR </Text>
                </Button>
            </Form>
          </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(33,150,243,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderStyle: "dotted"
  },
  rect2: {
    width: 360,
    height: 264,
    backgroundColor: "rgba(255,255,255,1)",
    marginTop: 255
  },
  txtUser: {
    height: 43,
    width: 285,
    backgroundColor: "rgba(155,155,155,0.25)",
    marginTop: 29,
    marginLeft: 38
  },
  txtPassword: {
    height: 43,
    width: 285,
    backgroundColor: "rgba(155,155,155,0.25)",
    marginTop: 17,
    marginLeft: 37
  },
  icon: {
    top: 0,
    left: 26,
    position: "absolute",
    color: "rgba(255,255,255,1)",
    fontSize: 40,
    height: 44,
    width: 40
  },
  btnLogin: {
    height: 52,
    width: 285,
    position: "absolute",
    left: 0,
    top: 0
  },
  iconStack: {
    top: 0,
    left: 0,
    width: 285,
    height: 52,
    position: "absolute"
  },
  ingresar: {
    top: 4,
    left: 111,
    position: "absolute",
    fontFamily: "Roboto",
    color: "rgba(255,255,255,1)",
    fontSize: 28
  },
  iconStackStack: {
    width: 285,
    height: 52,
    marginTop: 38,
    marginLeft: 38
  },
  rect: {
    width: 199,
    height: 156,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 26,
    marginTop: -457,
    marginLeft: 84
  },
  image: {
    width: 169,
    height: 143,
    marginTop: 6,
    marginLeft: 15
  }
});

export default Login;
