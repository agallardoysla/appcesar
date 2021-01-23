import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { actions } from "../../src/reduxConfig";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";

const AllData = ({
  login,
  zonas,
  navigation,
  asignaciones,
  busqueda,
  estado,
  entrega,
}) => {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);

  const dispatch = useDispatch();

  zonasData = async () => {
    setLoading(false);
    let userData = await AsyncStorage.getItem("userData");
    let data = JSON.parse(userData);
    fetch(`https://nelbermec.com/api/zonas_get/${data}`)
      .then((response) => response.json())
      .then((responseJson) => {
        dispatch(actions.actualizarZonas(responseJson));
        setLoading1(true);
      });
  };

  asignacionesData = async () => {
    let userData = await AsyncStorage.getItem("userData");
    let data = JSON.parse(userData);
    const usuario = data;
    fetch(`https://nelbermec.com/api/asignacionesPorZonasApp/${usuario}`)
      .then((response) => response.json())
      .then((responseJson) => {
        dispatch(actions.actualizarAsignaciones(responseJson));
        setLoading2(true);
      });
  };

  fetchBusquedaManual = () => {
    const term = "";
    fetch(`https://nelbermec.com/api/busquedaCodigo/${term}`)
      .then((response) => response.json())
      .then((responseJson) => {
        dispatch(actions.actualizarBusqueda(responseJson));
        setLoading3(true);
      });
  };

  fetchEstados = () => {
    fetch(`https://nelbermec.com/api/getEstados`)
      .then((response) => response.json())
      .then((responseJson) => {
        dispatch(actions.actualizarEstado(responseJson));
        setLoading4(true);
      });
  };

  useEffect(() => {
    zonasData();
    asignacionesData();
    fetchBusquedaManual();
    fetchEstados();
  }, []);

  useEffect(() => {
    if (loading1 && loading2 && loading3 && loading4) {
      entrega.entrega.map((e) => {
        let newbusqueda = busqueda.busqueda;

        newbusqueda = newbusqueda.filter(
          (b) => b.asignacion_id != e.idAsignacion
        );

        let newasignaciones = asignaciones.asignaciones;

        newasignaciones = newasignaciones.map((z) => {
          let newzonaasignaciones = z.asignaciones;
          newzonaasignaciones = newzonaasignaciones.filter(
            (b) => b.asignacion_id != e.idAsignacion
          );
          return { ...z, asignaciones: newzonaasignaciones };
        });

        dispatch(actions.actualizarAsignaciones([...newasignaciones]));
        dispatch(actions.actualizarBusqueda([...newbusqueda]));
      });

      setLoading(true);
      navigation.navigate("Zonas");
    } else {
      setLoading(false);
    }
  }, [loading1, loading2, loading3, loading4]);

  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#FFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ed6d2d",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

const mapStateToProps = ({
  login,
  zonas,
  asignaciones,
  busqueda,
  estado,
  entrega,
}) => ({
  login,
  zonas,
  asignaciones,
  busqueda,
  entrega,
  estado,
});

export default connect(mapStateToProps)(AllData);
