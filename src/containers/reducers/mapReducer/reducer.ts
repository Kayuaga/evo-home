import { handleActions, Action } from "redux-actions";
import { setMap } from "./actions";
import { fieldActions } from "../sessionReducer";

const initialState: string[][] = [[]];

export const mapReducer = handleActions(
  {
    [`${setMap}`]: (state, action: Action<string[][]>) => {
      return action.payload;
    },
    [`${fieldActions.startNewGame}`]: () => {
      return initialState;
    }
  },
  initialState
);
