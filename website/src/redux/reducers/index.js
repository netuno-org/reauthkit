import { combineReducers } from '@reduxjs/toolkit';

import {profileReducer} from "./profile.js";

export const rootReducer = combineReducers({
  profile: profileReducer,
});
