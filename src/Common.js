import react from 'react'
function Common (){

    getUsuario = async () => {
        try {
          const usuario = await AsyncStorage.getItem('idUsuario');
          if (usuario !== null) {
            // We have data!!
            console.log(value);
    
          }
        } catch (error) {
          // Error retrieving data
        }
      };

  // fetch(URL
    //method:'POST',
    // headers:{
    //   'Accept':'aplication/json',
    //   'Content-Type':'aplication/json'
    // },
    // body: JSON.stringify({
    //   email: correo,
    //   password: clave
    // })
//   ).then((respuesta)=> respuesta.json())
//   .then((responseJson) => {
//     if(responseJson.result == true){
//       this.storeToken(responseJson.id);
//       this.props.navigation.navigate('Zonas');
//     }else{
//       alert(responseJson.message);
//     }
//   }).catch((error) => {
//     alert(error(error))
//   })

// }

  // fetch(URL
    //method:'POST',
    // headers:{
    //   'Accept':'aplication/json',
    //   'Content-Type':'aplication/json'
    // },
    // body: JSON.stringify({
    //   email: correo,
    //   password: clave
    // })
//   ).then((respuesta)=> respuesta.json())
//   .then((responseJson) => {
//     if(responseJson.result == true){
//       this.storeToken(responseJson.id);
//       this.props.navigation.navigate('Zonas');
//     }else{
//       alert(responseJson.message);
//     }
//   }).catch((error) => {
//     alert(error(error))
//   })

// }

  // fetch(URL
    //method:'POST',
    // headers:{
    //   'Accept':'aplication/json',
    //   'Content-Type':'aplication/json'
    // },
    // body: JSON.stringify({
    //   email: correo,
    //   password: clave
    // })
//   ).then((respuesta)=> respuesta.json())
//   .then((responseJson) => {
//     if(responseJson.result == true){
//       this.storeToken(responseJson.id);
//       this.props.navigation.navigate('Zonas');
//     }else{
//       alert(responseJson.message);
//     }
//   }).catch((error) => {
//     alert(error(error))
//   })

// }


}

export default Common