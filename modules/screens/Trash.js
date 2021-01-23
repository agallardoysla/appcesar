createFormData = (objeto) => {
  const formData = new FormData();

  //ad to data
  objeto.LocalImage.forEach((item, i) => {
    formData.append("userfile[]", {
      uri: item,
      type: "image/jpeg",
      name: item.filename || `filename${i}.jpg`,
    });
  });
  // formData.append("userfile[]", images);
  formData.append("estado", objeto.estado);
  formData.append("latitude", objeto.latitude);
  formData.append("longitude", objeto.longitude);
  formData.append("idAsignacion", objeto.idAsignacion);
  formData.append("comentario", objeto.comentario);

  return formData;
};

sendFetch = async (formData) => {
  await fetch("https://nelbermec.com/api/registrarEntrega", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.result == true) {
        alert(responseJson.message);
        // console.log(responseJson);
      } else {
        alert(responseJson.message);
      }
      // this.setState({
      //   isLoading: false,
      // });
      // console.log("reponse:", responseJson);
    })
    .catch((err) => {
      alert(err);
      // console.log(err);
      // this.setState({
      //   isLoading: false,
      // });
    });
};

let asignacionesAntes;
asignacionesAntes = asignaciones.asignaciones.map((item) => {
  let zonasAsignacionesAntes = item.asignaciones;
  zonasAsignacionesAntes = zonasAsignacionesAntes.filter((b) => b);
  console.log(
    "Zonas-asignaciones-zonasAsignacionesAntes:",
    zonasAsignacionesAntes.length
  );
});
