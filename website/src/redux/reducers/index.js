import { combineReducers } from '@reduxjs/toolkit';

import {peopleReducer} from "./people.js";

export const rootReducer = combineReducers({
  people: peopleReducer,
});
