import { put, takeLatest } from "redux-saga/effects";
import { Action } from "redux-actions";

import { mapAction, botSelectors, botAction } from "containers/reducers";
import {
  ejectCellsCoordinates,
  getMapPartsWithBombs
} from "containers/sagas/BotSaga/botSageSetvices";

function* prepareMapData(action: Action<string>) {
  const responsedMap: string = action.payload;
  const splitedMapByRaws: string[] = responsedMap.trim().split("\n");
  const fullMap: string[][] = splitedMapByRaws.map(mapRaw => mapRaw.split(""));
  const { bombedCells } = getMapPartsWithBombs(fullMap);
  const bombedIndexes: Set<string> = ejectCellsCoordinates(bombedCells);
  yield put(botAction.setBombedIndexes(bombedIndexes));
  yield put(mapAction.setMap(fullMap));
}

export const DataSaga = [takeLatest(mapAction.getLoadedMap, prepareMapData)];
