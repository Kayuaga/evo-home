import React, { FC, memo } from "react";
import classname from "classnames";
import { Grid, ColumnSizer } from "react-virtualized";

import { MapProps } from "components";
import "react-virtualized/styles.css";

import classes from "./styles.module.css";

const MapView: FC<MapProps> = props => {
  const { map = [[]], sendCoordinates, bombedCells, isHelpNeeded } = props;
  return (
    <ColumnSizer
      columnMaxWidth={100}
      columnMinWidth={100}
      columnCount={map[0].length}
      width={1000}
    >
      {({ adjustedWidth, getColumnWidth, registerChild }) => {
        return (
          <Grid
            ref={registerChild}
            cellRenderer={({ columnIndex, key, rowIndex, style }) => {
              const cell = map[rowIndex][columnIndex];
              const cellStyle = classname(classes.cellContainer, {
                [classes.clicked]: parseInt(cell) >= 0,
                [classes.fired]:
                  cell === "*" || ( isHelpNeeded && bombedCells.has(`${columnIndex} ${rowIndex}`))
              });
              return (
                <span
                  className={cellStyle}
                  key={key}
                  style={style}
                  onClick={sendCoordinates(columnIndex, rowIndex)}
                >
                  {cell}
                </span>
              );
            }}
            columnCount={map[0].length}
            columnWidth={50}
            height={700}
            rowCount={map.length}
            rowHeight={50}
            width={adjustedWidth}
          />
        );
      }}
    </ColumnSizer>
  );
};

export const Map = memo(MapView);
