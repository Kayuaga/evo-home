import React, { FC, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fieldActions, mapSelectors, botSelectors } from "containers/reducers";
import { socketCommands } from "Constants";
import { Map } from "components";

export const ViewContainer: FC = () => {
  const dispatch = useDispatch();
  const map = useSelector(mapSelectors.getMap);
  const bombedCells = useSelector(botSelectors.getBombedIndexes)
  const isHelpNeeded = useSelector(botSelectors.getIsHelpNeeed)

  const sendCoordinates = useCallback(
    (x, y) => () =>
      dispatch(
        fieldActions.sendMessage(socketCommands.createOpenMessage(x, y))
      ),
    [map]
  );


  return (
    <Map
      map={map}
      bombedCells={bombedCells}
      sendCoordinates={sendCoordinates}
      isHelpNeeded={isHelpNeeded}
    />
  );
};

export const MapModule = memo(ViewContainer);
