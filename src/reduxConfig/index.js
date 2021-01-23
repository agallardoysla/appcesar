import { combineReducers } from "redux";

import login, { actualizarLogin } from "./reducers/login";
import zonas, { actualizarZonas } from "./reducers/zonas";
import asignaciones, { actualizarAsignaciones } from "./reducers/asignaciones";
import busqueda, { actualizarBusqueda } from "./reducers/busqueda";
import estado, { actualizarEstado } from "./reducers/estados";
import entrega, { actualizarEntrega } from "./reducers/entregas";

const appReducer = combineReducers({
  login,
  zonas,
  asignaciones,
  busqueda,
  estado,
  entrega,
});

export default (state, action) => {
  if (action.type === "LOGOUT") {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export const actions = {
  actualizarLogin,
  actualizarZonas,
  actualizarAsignaciones,
  actualizarBusqueda,
  actualizarEstado,
  actualizarEntrega,
};
