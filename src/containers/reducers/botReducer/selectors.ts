import { AppState } from "containers/types";

export const getBotState = (state: AppState) => state.bot;
export const getBoIsActive = (state: AppState) =>
  getBotState(state).isBotActive;
export const getIsEventsBlocked = (state: AppState) =>
  getBotState(state).isEventBlocked;

export const getSelectedLevel = (state: AppState) =>
         getBotState(state).levelNumber;

export const getBombedIndexes = (state: AppState) =>
    getBotState(state).bombedCells;

export const getIsHelpNeeed = (state: AppState) => getBotState(state).needHelp