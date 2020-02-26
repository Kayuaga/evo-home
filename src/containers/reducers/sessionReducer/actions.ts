import { createAction } from "redux-actions";

import { LevelType } from "./types";

import { actionNames } from "Constants";

export const startNewLevel = createAction<LevelType>(
  actionNames.START_NEW_LEVEL
);
export const getHelp = createAction<void>(actionNames.GET_HELP);
export const getCurrentMap = createAction<number>(actionNames.GET_CURRENT_MAP);
export const sendMessage = createAction<string>(actionNames.SEND_MESSAGE);
export const startNewGame = createAction<void>(actionNames.START_NEW_GAME);
export const stopSession = createAction<void>(actionNames.STOP_SESSION);
export const levelStarted = createAction<void>(actionNames.LEVEL_STARTED);
export const connectionOpened = createAction<void>(actionNames.CONNECTION_OPENED)
export const handleOpenAnswer = createAction<string>(actionNames.HANDLE_OPEN_ANSWER)
export const counting = createAction<void>(actionNames.COUNTING)
export const okContinue = createAction<void>(actionNames.OK_CONTINUE)
