import { createAction } from "redux-actions";

import { actionNames } from "Constants";

export const getLoadedMap = createAction<string>(actionNames.MAP_LOADED);
export const setMap = createAction<string[][]>(actionNames.SET_MAP);
export const startBot = createAction<void>(actionNames.START_BOT);

