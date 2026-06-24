import {PROFILE_LOAD} from '../actions/actionTypes';

const initialState = {
  data: null,
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
  case PROFILE_LOAD:
    return {
      ...state,
      data: action.payload
    };
  default:
    return state;
  }
};
