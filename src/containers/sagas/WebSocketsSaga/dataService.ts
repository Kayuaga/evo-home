import { Action } from "redux-actions";
import { socketAnswers, actionNames, socketCommands } from "Constants";
import { mapAction, fieldActions, botAction } from "containers/reducers";

const removeStringAfterDots = (str: string) => str.replace(/.*:/, "");

export const parseMessage = (
  message: string = "",
  isBotActivated: boolean,
): Action<any> => {

  const comparable = message.toLowerCase();
  const messageValue = removeStringAfterDots(message)
    .toLowerCase()
    .trim();
  if(message.includes('password')){
    console.log(message)
  }


  if (comparable === actionNames.CONNECTION_OPENED.toLowerCase()) {
    return fieldActions.connectionOpened();
  }
  if (comparable.includes(socketAnswers.NEW_)) {
    return fieldActions.sendMessage(socketCommands.MAP);
  }

  if (comparable.includes(socketAnswers.MAP)) {
    const map = removeStringAfterDots(message);
      return isBotActivated
        ? botAction.solveField(map)
        : mapAction.getLoadedMap(map);
    }

  if (comparable.includes(socketAnswers.OPEN)) {
    return fieldActions.handleOpenAnswer(messageValue)
      }
  return fieldActions.counting();
};
