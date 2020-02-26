import { handleActions, Action } from "redux-actions";
import {
  botLaunch,
  stopBot,
  selectLevel,
  setBombedIndexes,
  needHelp
} from "./actions";
import { BotState } from "containers/types";
import {fieldActions} from "../sessionReducer";

const initialState: BotState = {
  isEventBlocked: false,
  isBotActive: false,
  levelNumber: 1,
  bombedCells: new Set(""),
  needHelp: false,
};

//There is a problem with react-actions reducer types, so for huge reducer with multiple actions it needed to write "any type" =(((
export const botReducer = handleActions<any, any>(
  {
    [`${botLaunch}`]: state => {
      return { ...state, isBotActive: true };
    },
    [`${stopBot}`]: state => {
      return { ...state, isBotActive: false };
    },

    [`${selectLevel}`]: (state, action: Action<boolean>) => {
      return { ...state, levelNumber: action.payload };
    },
    [`${setBombedIndexes}`]: (state, action: Action<Set<string>>) => {
      return { ...state, bombedCells: action.payload };
    },
    [`${needHelp}`]: (state, action: Action<Set<boolean>>) => {
      return { ...state, needHelp: action.payload };
    },
    [`${fieldActions.startNewGame}`]: () => {
        return initialState
}
  },
  initialState
);
