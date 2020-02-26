import { ComparableCell, FieldPart } from "containers/types";

export const getNeighborsCells = (
  currentY: number,
  currentX: number,
  field: string[][]
): ComparableCell[] => {
  let x = currentX;
  let y = currentY;
  const neighborsCell: ComparableCell[] = [];
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (field[y + i] && field[y + i][x + j]) {
        const isClosed = isNaN(parseInt(field[y + i][x + j]));
        neighborsCell.push({ y: y + i, x: x + j, isClosed });
      }
    }
  }
  return neighborsCell;
};

export const groupArray = (
  array: ComparableCell[],
  centralCell: string
): FieldPart => {
  const arr = [...array];
  const jColumns = !(array.length % 3) ? 3 : 2;
  let iRows = array.length / jColumns;
  let fieldPart: ComparableCell[][] = [];
  for (let i = 0; i < iRows; i++) {
    fieldPart.push([]);
    for (let j = 0; j < jColumns; j++) {
      const cell = arr.shift();
      if (cell) fieldPart[i][j] = cell;
    }
  }
  return { centralCell, fieldPart };
};

export const isAllCellsClosed = (fieldPart: ComparableCell[][]): boolean => {
  return fieldPart.some(cellRaw => {
    return cellRaw.some(({ isClosed }) => {
      return !isClosed;
    });
  });
};

export const isAllCellsOpened = (fieldPart: ComparableCell[][]): boolean => {
  return fieldPart.some(cellRaw => {
    return cellRaw.some(({ isClosed }) => {
      return isClosed;
    });
  });
};

export const getClosedCells = (
  fieldPart: ComparableCell[][]
): ComparableCell[] => {
  return fieldPart.reduce((acc, fieldRow) => {
    const closedCells = fieldRow.filter(({ isClosed }) => isClosed);
    return [...acc, ...closedCells];
  }, []);
};

export const findBombedCells = ({
  fieldPart,
  centralCell
}: FieldPart): ComparableCell[] => {
  const possibleBombsAmount = parseInt(centralCell);
  const closedCells: ComparableCell[] = getClosedCells(fieldPart);
  if (!isNaN(possibleBombsAmount)) {
    if (closedCells.length === possibleBombsAmount) {
      return closedCells;
    }
  }
  return [];
};

export const getMapPartsWithBombs = (
  fullMap: string[][]
): { bombedCells: ComparableCell[]; mapParts: FieldPart[] } => {
  let bombedCells: ComparableCell[] = [];
  let mapParts: FieldPart[] = [];
  const rowsLength = fullMap.length;
  const columnLength = fullMap[0].length;

  for (let y = 0; y < rowsLength; y++) {
    for (let x = 0; x < columnLength; x++) {
      const neighborPart = getNeighborsCells(y, x, fullMap);
      const groupedPart = groupArray(neighborPart, fullMap[y][x]);
      const { centralCell } = groupedPart;
      const isCentrallCellExist = !isNaN(parseInt(centralCell));

      if (isCentrallCellExist && isAllCellsClosed(groupedPart.fieldPart))
        if (isAllCellsOpened(groupedPart.fieldPart)) {
          mapParts = [...mapParts, groupedPart];
          bombedCells = [...bombedCells, ...findBombedCells(groupedPart)];
        }
    }
  }

  return { bombedCells, mapParts };
};

interface ClosedFieldsWithBombs {
  closedCells: Set<string>;
  bombsAmount: number;
}
export const groupClosedCells = (
  fieldPart: ComparableCell[][],
  fullMap: string[][]
): ClosedFieldsWithBombs[] => {
  return fieldPart.reduce<ClosedFieldsWithBombs[]>((acc, raw) => {
    const groupedField = raw.reduce<ClosedFieldsWithBombs[]>((res, cell) => {
      const { x, y, isClosed } = cell;
      if (!isClosed) {
        const neighborPart = getNeighborsCells(y, x, fullMap);
        const { centralCell, fieldPart: currentPart } = groupArray(
          neighborPart,
          fullMap[y][x]
        );
        const closedCells = getClosedCells(currentPart).reduce(
          (resSet, cell) => resSet.add(`${cell.x} ${cell.y}`),
          new Set<string>()
        );

        const bombsAmount = parseInt(centralCell);
        if (closedCells.size) {
          return [...res, { closedCells, bombsAmount }];
        }
      }
      return res;
    }, []);
    return [...acc, ...groupedField];
  }, []);
};

const includesGroups = (firstMap: Set<string>, secondMap: Set<string>) => {
  const arr1 = Array.from(firstMap);
  const arr2 = Array.from(secondMap);
  if (arr1.length >= arr2.length) {
    const filteredArray = arr2.filter(i => arr1.includes(i));
    return arr2.length === filteredArray.length;
  } else {
    const filteredArray = arr1.filter(i => arr2.includes(i));
    return arr1.length === filteredArray.length;
  }
};

const equalSets = (firstMap: Set<string>, secondMap: Set<string>): boolean => {
  const arr1 = Array.from(firstMap);
  const arr2 = Array.from(secondMap);
  if (arr2.length !== arr1.length) return false;
  const filteredArray = arr1.filter(i => arr2.includes(i));
  return filteredArray.length === arr1.length;
};

const deleteCells = (
  firstGroup: ClosedFieldsWithBombs,
  secondGroup: ClosedFieldsWithBombs
) => {
  const { closedCells, bombsAmount } = firstGroup;
  const {
    closedCells: secondClosedCells,
    bombsAmount: substractableBombsAmount
  } = secondGroup;
  const substractableGroup = new Set(closedCells);

  if (equalSets(closedCells, secondClosedCells)) {
    return firstGroup;
  }
  secondClosedCells.forEach(cell => {
    substractableGroup.delete(cell);
  });

  const result = {
    closedCells: substractableGroup,
    bombsAmount: bombsAmount - substractableBombsAmount
  };

  return result;
};

export const substarctGropup = (
  firstGroup: ClosedFieldsWithBombs,
  secondGroup: ClosedFieldsWithBombs
) => {
  const { closedCells } = firstGroup;
  const { closedCells: secondClosedCells } = secondGroup;
  let res = [firstGroup, secondGroup];
  if (closedCells.size < secondClosedCells.size) {
    res = [secondGroup, firstGroup];
  }
  const [first, second] = res;
  const result = deleteCells(first, second);
  return result;
};

export const findMoreBombs = (
  bombedIndexes: Set<string>,
  mapParts: FieldPart[],
  fullMap: string[][]
): {
  groupOfClosedCells: ClosedFieldsWithBombs[];
  arrayForClick: ClosedFieldsWithBombs[];
}[] => {
  return mapParts.map(({ centralCell, fieldPart }) => {
    const groupOfClosedCells = groupClosedCells(fieldPart, fullMap);
    let arrayForClick: ClosedFieldsWithBombs[] = [];
    for (let i = 0; i < groupOfClosedCells.length; i++) {
      for (let j = 0; j < groupOfClosedCells.length; j++) {
        const fisrtGroup = groupOfClosedCells[i];
        const secondGroup = groupOfClosedCells[j];
        const isEquals = equalSets(
          fisrtGroup.closedCells,
          secondGroup.closedCells
        );
        if (isEquals && i !== j) {
          // groupOfClosedCells.splice(j, 1);
        }
        if (
          includesGroups(fisrtGroup.closedCells, secondGroup.closedCells) &&
          !isEquals
        ) {
          const newGroup = substarctGropup(fisrtGroup, secondGroup);
          if (newGroup) groupOfClosedCells[i] = newGroup;
          if (newGroup.bombsAmount === 0) {
            arrayForClick = [...arrayForClick, newGroup];
          }
        }
      }
    }
    return { groupOfClosedCells, arrayForClick };
  });
};

export const ejectCellsCoordinates = (
  bombedCells: ComparableCell[]
): Set<string> => {
  return bombedCells.reduce((acum, cell) => {
    const { x, y } = cell;
    acum.add(`${x} ${y}`);
    return acum;
  }, new Set<string>());
};

export const getIsBombedField = (
  closedCells: ComparableCell[],
  bombedCells: Set<string>,
  isBombed: boolean
): ComparableCell[] => {
  return closedCells.filter(({ x, y }) => {
    return bombedCells.has(`${x} ${y}`) === isBombed;
  });
};

export const findCellsForClick = (
  bombedCells: Set<string>,
  fieldParts: FieldPart[]
) => {
  const cellsForClick = fieldParts.reduce<ComparableCell[]>(
    (acum, { centralCell, fieldPart }) => {
      const closedCells = getClosedCells(fieldPart);
      const bombsAmount = parseInt(centralCell);
      const cellsWithBombs = closedCells.filter(({ x, y }) =>
        bombedCells.has(`${x} ${y}`)
      );
      if (
        cellsWithBombs.length &&
        !isNaN(bombsAmount) &&
        cellsWithBombs.length === bombsAmount &&
        closedCells.length !== bombsAmount
      ) {
        const cellToOpen = closedCells.filter(({ x, y }) => {
          return !bombedCells.has(`${x} ${y}`);
        });
        return [...acum, ...cellToOpen];
      }
      return acum;
    },
    []
  );
  return ejectCellsCoordinates(cellsForClick);
};
