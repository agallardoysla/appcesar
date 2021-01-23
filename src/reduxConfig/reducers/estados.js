export const ACTUALIZAR_ESTADO = "ACTUALIZAR_ESTADO";

export const actualizarEstado = (estado) => ({
  type: ACTUALIZAR_ESTADO,
  estado,
});

const initialState = {
  estado: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTUALIZAR_ESTADO:
      return {
        ...state,
        estado: action.estado,
      };
    default:
      return state;
  }
};
