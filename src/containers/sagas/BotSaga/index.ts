import { put, takeLatest, take, call } from "redux-saga/effects";
import { Action } from "redux-actions";
import { socketCommands } from "Constants";
import { botAction, fieldActions, mapAction } from "containers/reducers";

import {
  getMapPartsWithBombs,
  ejectCellsCoordinates,
  findCellsForClick,
  getClosedCells,
  findMoreBombs
} from "./botSageSetvices";

import { ComparableCell } from "containers/types";

function* randomClick(
  mapParts: any[],
  bombedIndexes: Set<string>,
  fullMap: string[][]
) {
  const closedCells = mapParts.reduce<ComparableCell[]>(
    (acc, { fieldPart }) => {
      const closedField = getClosedCells(fieldPart);
      return [...acc, ...closedField];
    },
    []
  );

  const saveClosedCell = closedCells.filter(
    ({ x, y }) => !bombedIndexes.has(`${x} ${y}`)
  );

  let coordinateMessage = "";
  if (saveClosedCell.length) {
    const randomIndex = Math.floor(
      Math.random() * Math.floor(saveClosedCell.length)
    );
    const { x, y } = saveClosedCell[randomIndex];
    coordinateMessage = socketCommands.createOpenMessage(`${x}`, `${y}`);
  } else {
    const randomX = Math.floor(Math.random() * Math.floor(fullMap[0].length));
    const randomY = Math.floor(Math.random() * Math.floor(fullMap.length));
    coordinateMessage = `open ${randomX} ${randomY}`;
  }
  yield put(fieldActions.sendMessage(coordinateMessage));
  yield take(fieldActions.okContinue);
  yield put(fieldActions.sendMessage(socketCommands.MAP));
  return;
}

function* solveField(action: Action<string>) {
  const responsedMap = action.payload;
  const splitedMapByRaws = responsedMap.trim().split("\n");
  const fullMap = splitedMapByRaws.map(mapRaw => mapRaw.split(""));
  const { bombedCells, mapParts } = getMapPartsWithBombs(fullMap);

  const bombedIndexes: Set<string> = ejectCellsCoordinates(bombedCells);
  const moreBombs = findMoreBombs(bombedIndexes, mapParts, fullMap);
  const cellsForClick = new Set<string>();

  moreBombs.map(({ groupOfClosedCells, arrayForClick }) => {
    groupOfClosedCells.map(group => {
      const { bombsAmount, closedCells } = group;
      if (bombsAmount === closedCells.size) {
        closedCells.forEach(value => {
          bombedIndexes.add(value);
        });
      }
    });

    if (arrayForClick.length) {
      arrayForClick.map(group => {
        const { bombsAmount, closedCells } = group;
        if (bombsAmount === 0) {
          closedCells.forEach(value => cellsForClick.add(value));
        }
      });
    }
  });

  const cells = findCellsForClick(bombedIndexes, mapParts);
  const cellArr = [...Array.from(cells), ...Array.from(cellsForClick)];

  if (cellArr.length) {
    for (let cell of cellArr) {
      yield put(fieldActions.sendMessage(`${socketCommands.OPEN} ${cell}`));
      yield take(fieldActions.okContinue);
    }
  } else {
    yield call(randomClick, mapParts, bombedIndexes, fullMap);
  }
  yield put(fieldActions.sendMessage(socketCommands.MAP));
  yield put(mapAction.setMap(fullMap));
}

export const BotSaga = [takeLatest(botAction.solveField, solveField)];
