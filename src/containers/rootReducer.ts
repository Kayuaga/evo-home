import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { mapReducer, botReducer} from "./reducers";
import { AppState} from "./types";

export default (history:any) =>
  combineReducers<AppState>({
    router: connectRouter(history),
      bot: botReducer,
      map: mapReducer,
  });
