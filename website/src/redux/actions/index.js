import {
  PEOPLE_LOAD
} from './actionTypes';

export const peopleLoadAction = (data) => ({
  type: PEOPLE_LOAD,
  payload: { ...data }
});

