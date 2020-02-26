import React, { FC, } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import store from "./containers/store";
import { history } from "./containers/store";
import { RightMenuModule, MapModule } from "./modules";
import "./App.module.css";
import style from "./App.module.css";

const App: FC = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <RightMenuModule />
          <div className={style.gameContainer}>
            <MapModule />
          </div>
        </ConnectedRouter>
      </Provider>
    </div>
  );
};

export default App;
