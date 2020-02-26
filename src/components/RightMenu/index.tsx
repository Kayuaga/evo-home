import React, { FC, memo, useState, useCallback, Fragment } from "react";
import { RighMenuProps } from "components/types/rightMenuTypes";

import classes from "./styles.module.css";

const RightMenuView: FC<RighMenuProps> = props => {
  const {
    startGame,
    startNewLevel,
    stopSession,
    startBot,
    getMap,
    selectLevel,
    needHelp
  } = props;
  const [isGameStarted, setGameStarted] = useState(false);
  const [count, setLevel] = useState(1);

  const setCount = useCallback(
    e => {
      selectLevel(parseInt(e.target.value));
      setLevel(parseInt(e.target.value));
    },
    [count]
  );
  const stopGame = useCallback(() => {
    setGameStarted(false);
    stopSession();
  }, []);

  const startGameSession = useCallback(() => {
    startGame();
    setGameStarted(true);
  }, []);

  return (
    <div className={classes.rightMenuContainer}>
      <ul>
        {!isGameStarted && (
          <li className={classes.menuItem} onClick={startGameSession}>
            <button>START NEW GAME</button>
          </li>
        )}
        {isGameStarted && (
          <Fragment>
            <li className={classes.menuItem}>
              <button onClick={startNewLevel(count)}>START NEW LEVEL</button>
              <select onChange={setCount}>
                {[1, 2, 3, 4].map((val, i) => {
                  return <option key={i + val}>{val}</option>;
                })}
              </select>
            </li>

            <li className={classes.menuItem}>
              <button onClick={startBot}>START BOT</button>
            </li>
            <li className={classes.menuItem}>
              <button onClick={getMap}>GET MAP</button>
            </li>

            <li className={classes.menuItem}>
              <button onClick={stopGame}>STOP SESSION</button>
            </li>
            <li className={classes.menuItem}>
              <button onClick={needHelp(true)}>NEED HELP</button>
            </li>
          </Fragment>
        )}
      </ul>
    </div>
  );
};

export const RightMenu = memo(RightMenuView);
/*
* 
* help      - returns valid commands
new L     - starts new session, L=1|2|3|4
map       - returns the current map
open X Y  - opens cell at X,Y coordinates
* */
