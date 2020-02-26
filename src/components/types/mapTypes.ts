import { Action } from "redux-actions";
import { MapState } from "containers/types";

export interface MapProps extends MapState {
  sendCoordinates: (x: number, y: number) => () => Action<string>;
  bombedCells: Set<string>
  isHelpNeeded: boolean

}
