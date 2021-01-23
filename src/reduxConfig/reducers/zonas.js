export const ACTUALIZAR_ZONAS = "ACTUALIZAR_ZONASs";

export const actualizarZonas = (zonas) => ({
  type: ACTUALIZAR_ZONAS,
  zonas,
});

const initialState = {
  zonas: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTUALIZAR_ZONAS:
      return {
        ...state,
        zonas: action.zonas,
      };
    default:
      return state;
  }
};
