export const ACTUALIZAR_ASIGNACIONES = "ACTUALIZAR_ASIGNACIONES";

export const actualizarAsignaciones = (asignaciones) => ({
  type: ACTUALIZAR_ASIGNACIONES,
  asignaciones,
});

const initialState = {
  asignaciones: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTUALIZAR_ASIGNACIONES:
      return {
        ...state,
        asignaciones: action.asignaciones,
      };
    default:
      return state;
  }
};
