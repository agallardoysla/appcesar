export const ACTUALIZAR_ENTREGA = "ACTUALIZAR_ENTREGA";

export const actualizarEntrega = (entrega) => ({
  type: ACTUALIZAR_ENTREGA,
  entrega,
});

const initialState = {
  entrega: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTUALIZAR_ENTREGA:
      return {
        ...state,
        entrega: action.entrega,
      };
    default:
      return state;
  }
};
