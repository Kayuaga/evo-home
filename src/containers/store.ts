import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import createSagaMiddleware from "redux-saga";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import rootReducer from "./rootReducer";
import { rootSaga } from "./sagas";

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

export default createStore(
  rootReducer(history),
  composeWithDevTools(
    applyMiddleware(sagaMiddleware, routerMiddleware(history))
  )
);

sagaMiddleware.run(rootSaga);