import user_types from "./types";

const init_state = {
  id: 0,
  role: "",
};

// state itu statenya action itu setStatenya
function userReducer(state = init_state, action) {
  //property type dan payload merupakan bawaan
  if (action.type === user_types.USER_LOGIN) {
    return {
      ...state,
      id: action.payload.id,
      role: action.payload.role,
    };
  } else if (action.type === user_types.USER_LOGOUT) {
    return init_state;
  }
  return state;
}

export default userReducer;
