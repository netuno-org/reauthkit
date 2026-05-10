import {WS_LOAD} from '../actions/actionTypes';

const initialState = {
  data: null,
};

export const wsReducer = (state = initialState, action) => {
  switch (action.type) {
  case WS_LOAD:
    return {
      ...state,
      data: action.payload
    };
  default:
    return state;
  }
};
