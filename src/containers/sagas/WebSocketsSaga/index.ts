import {
  call,
  takeEvery,
  cancel,
  take,
  put,
  select,
  takeLatest
} from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { Action } from "redux-actions";
import { app_url, actionNames, socketAnswers, socketCommands } from "Constants";

import { botAction, botSelectors, fieldActions } from "containers/reducers";

import { parseMessage } from "./dataService";

const socketListener = (ws: WebSocket) => {
  return eventChannel(emitter => {
    ws.onmessage = data => emitter(data);
    ws.onopen = () => emitter({ data: actionNames.CONNECTION_OPENED });
    ws.onerror = () => emitter({ data: "ERROR" });
    ws.onclose = () => {
      emitter({ data: "CLOSE" });
    };
    return () => ws.close();
  });
};

const createWebSocket = (app_url: string) => {
  return new WebSocket(app_url);
};

function* sendMessageSaga(ws: WebSocket, action: Action<string>) {
  ws.send(action.payload);
}

function* handleSocketAnswer({ data }: any) {
  const isBotActivated = yield select(botSelectors.getBoIsActive);

  const action = parseMessage(data, isBotActivated);
  yield put(action);
}

function* sessionHandler() {
  try {
    const ws = createWebSocket(process.env.REACT_APP_WS_ADRESS || app_url);
    const chan = yield call(socketListener, ws);
    const session = yield takeEvery(chan, handleSocketAnswer);
    yield take(fieldActions.connectionOpened);
    const sendMessage = yield takeEvery(
      fieldActions.sendMessage,
      sendMessageSaga,
      ws
    );
    yield take(fieldActions.stopSession);
    ws.close();
    yield cancelWorkerSaga([sendMessage, session]);
  } catch (e) {
    console.error(e);
  }
}

function* cancelWorkerSaga(tasks: any[]) {
  for (let task of tasks) {
    yield cancel(tasks);
  }
}

function* startNewWebSocketSession() {
  yield call(sessionHandler);
}

function* handleOpenAnswer(action: Action<string>) {
  const messageValue = action.payload;
  const isBotActive = yield select(botSelectors.getBoIsActive);
  const level = yield select(botSelectors.getSelectedLevel);
  switch (messageValue) {
    case socketAnswers.YOU_LOSE:
      yield put(botAction.stopBot());
      yield put(fieldActions.sendMessage(socketCommands.MAP));
      break;

    case socketAnswers.OPEN:
      return yield put(fieldActions.sendMessage(socketCommands.MAP));
    case socketAnswers.OK:
      return isBotActive
        ? yield put(fieldActions.okContinue())
        : yield put(fieldActions.sendMessage(socketCommands.MAP));

    default:
      break;
  }
}

function* botLaunch() {
  yield put(botAction.botLaunch());
  const level = yield select(botSelectors.getSelectedLevel);
  yield put(
    fieldActions.sendMessage(socketCommands.createNewLevelMessage(level))
  );
  return;
}

export const WebSocketsSaga = [
  takeEvery(fieldActions.startNewGame, startNewWebSocketSession),
  takeEvery(fieldActions.handleOpenAnswer, handleOpenAnswer),
  takeLatest(botAction.startBot, botLaunch)
];
