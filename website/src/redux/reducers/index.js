import { combineReducers } from '@reduxjs/toolkit';

import {profileReducer} from "./profile.js";
import {wsReducer} from "./ws.js";

export const rootReducer = combineReducers({
  profile: profileReducer,
  ws: wsReducer,
});
