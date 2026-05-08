import {
  PROFILE_LOAD
} from './actionTypes';

export const profileLoadAction = (data) => ({
  type: PROFILE_LOAD,
  payload: data ? { ...data } : null
});

