import React, { FC, useCallback, useMemo, memo } from "react";
import { useDispatch } from "react-redux";
import { fieldActions, botAction } from "containers/reducers";
import { RightMenu, RighMenuProps } from "components";
import { socketCommands } from "Constants";

const ViewContainer: FC = () => {
  const dispatch = useDispatch();
  const startGame = useCallback(() => {
    return dispatch(fieldActions.startNewGame());
  }, []);

  const needHelp = useCallback(
    (isHelp: boolean) => () => dispatch(botAction.needHelp(isHelp)),
    []
  );
  const startNewLevel = useCallback(
    i => () => {
      return dispatch(
        fieldActions.sendMessage(socketCommands.createNewLevelMessage(i))
      );
    },
    []
  );
  const getMap = useCallback(
    () => dispatch(fieldActions.sendMessage(socketCommands.MAP)),
    []
  );

  const stopSession = useCallback(
    () => dispatch(fieldActions.stopSession()),
    []
  );

  const startBot = useCallback(() => {
    return dispatch(botAction.startBot())
  }, []);

  const selectLevel = useCallback(
    (level: number) =>  dispatch(botAction.selectLevel(level)),
    []
  );

  const propsView: RighMenuProps = {
    startGame,
    startNewLevel,
    getMap,
    stopSession,
    startBot,
    selectLevel,
    needHelp
  };
  return <RightMenu {...propsView} />;
};

export const RightMenuModule = memo(ViewContainer);
/*
*
* help      - returns valid commands
new L     - starts new session, L=1|2|3|4
map       - returns the current map
open X Y  - opens cell at X,Y coordinates
* */
