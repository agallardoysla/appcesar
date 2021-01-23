export const ACTUALIZAR_BUSQUEDA = "ACTUALIZAR_BUSQUEDA";

export const actualizarBusqueda = (busqueda) => ({
  type: ACTUALIZAR_BUSQUEDA,
  busqueda,
});

const initialState = {
  busqueda: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTUALIZAR_BUSQUEDA:
      return {
        ...state,
        busqueda: action.busqueda,
      };
    default:
      return state;
  }
};
