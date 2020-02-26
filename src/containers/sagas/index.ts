import { all } from 'redux-saga/effects';
import { WebSocketsSaga } from './WebSocketsSaga'
import { DataSaga } from './DataSaga'
import  {BotSaga } from './BotSaga'


export function *rootSaga(){
    yield all([...WebSocketsSaga, ...DataSaga, ...BotSaga])
}