import { createAction } from "redux-actions";

import { actionNames } from "Constants";

export const startBot = createAction<void>(actionNames.START_BOT);
export const botLaunch = createAction<void>(actionNames.BOT_LAUNCH);
export const stopBot = createAction<void>(actionNames.STOP_BOT);
export const solveField = createAction<string>(actionNames.SOLVE_FIELD);
export const selectLevel = createAction<number>(actionNames.SELECT_LEVEL);
export const setBombedIndexes = createAction<Set<string>>(
  actionNames.SET_BOMBED_INDEXES
);
export const needHelp = createAction<boolean>(actionNames.NEED_HELP);
