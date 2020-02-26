import { Action } from "redux-actions";
export interface RighMenuProps {
  startGame: () => Action<void>;
  startNewLevel: (l: number) => () => Action<string>;
  stopSession: () => Action<void>;
  getMap: () => Action<string>;
  startBot: () => Action<void>;
  selectLevel: (level: number) => Action<number>;
  needHelp: (needHelp: boolean) => () => Action<boolean>
}