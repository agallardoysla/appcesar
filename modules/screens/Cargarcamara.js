import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { Camera } from 'expo-camera'

export default function Cargarcamara() {

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5};
      let photo = await ImagePicker.launchCameraAsync(options)
      if (photo) {
        this.setState({ imageuri: photo.uri });
      }

      console.log(photo);

      if (!photo.cancelled) {
        setImage(photo.uri);
      }

    }
  };

  //  const takePicture = async () => {
  //   if (this.camera) {
  //     let photo = await this.camera.takePictureAsync({
  //       base64: true,
  //     });
  //     // this.props.cameraToggle(false);
  //     // this.setState({ captures: photo.uri });
  //     setImage(photo.uri);
  //   }
  // };


  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 0.5,
  //   });

  //   console.log(result);

  //   if (!result.cancelled) {
  //     setImage(result.uri);
  //   }
  // };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Cámara" onPress={takePicture} />
      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
    </View>
  );
}