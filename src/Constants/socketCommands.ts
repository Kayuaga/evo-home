export const MAP = "map";
export const OPEN = "open";

export const createOpenMessage = (x: string, y: string): string =>
  `${OPEN} ${x} ${y}`;

export const createNewLevelMessage = (level: number): string => `new ${level}`;
