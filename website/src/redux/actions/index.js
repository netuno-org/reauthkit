import {
  PROFILE_LOAD,
  WS_LOAD
} from './actionTypes';

export const profileLoadAction = (data) => ({
  type: PROFILE_LOAD,
  payload: data ? { ...data } : null
});

export const wsLoadAction = (data) => ({
  type: WS_LOAD,
  payload: data ? { ...data } : null
});

