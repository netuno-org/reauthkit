import {PEOPLE_LOAD} from '../actions/actionTypes';

const initialState = {
  data: null,
};

export const peopleReducer = (state = initialState, action) => {
  switch (action.type) {
  case PEOPLE_LOAD:
    return {
      ...state,
      data: action.payload
    };
  default:
    return state;
  }
};
