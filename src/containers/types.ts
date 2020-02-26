import { RouterState} from 'connected-react-router'

export interface MapState {
    map: string[][]
}

export interface BotState {
    isBotActive: boolean
    isEventBlocked: boolean
    levelNumber: number
    bombedCells: Set<string>
    needHelp: boolean
}

export interface AppState extends MapState{
    router: RouterState
    bot: BotState
}

export interface ComparableCell {
    x: number;
    y: number;
    isClosed: boolean;
}

export interface FieldPart {
    centralCell: string;
    fieldPart: ComparableCell[][];
}
