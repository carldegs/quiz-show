import React, { useState, useEffect } from "react";
import { Table, TableProps, Segment } from "semantic-ui-react";

import orderBy from "lodash/fp/orderBy";

export interface Column {
  name: string;
  value: string;
  sortable?: boolean;
  render?: Function;
  format?: Function;
}

interface IProps extends TableProps {
  columnList: Column[];
  data: any;
  emptyMsg?: string;
}

const getLodashOrder = (order: string) => {
  switch (order) {
    case "ascending":
      return "asc";
    case "descending":
    default:
      return "desc";
  }
};

const MainTable = ({
  columnList,
  data,
  sortable,
  emptyMsg = "No items.",
  ...props
}: IProps) => {
  const [sort, setSort] = useState({
    column: columnList[0].value,
    direction: "ascending",
  } as {
    column: string;
    direction: "ascending" | "descending";
  });
  const [modifiedData, modifyData] = useState(data);

  const handleSort = (colVal: string) => {
    if (colVal === sort.column) {
      setSort({
        ...sort,
        direction: sort.direction === "ascending" ? "descending" : "ascending",
      });
    } else {
      setSort({
        column: colVal,
        direction: "ascending",
      });
    }

    modifyData(orderBy([colVal], [getLodashOrder(sort.direction)], data));
  };

  useEffect(() => {
    modifyData(data);
  }, [data]);

  return (
    <>
      <Table {...props}>
        <Table.Header>
          <Table.Row>
            {columnList.map((col) => (
              <Table.HeaderCell
                sorted={
                  col.sortable && sort.column === col.value
                    ? sort.direction
                    : undefined
                }
                key={col.value}
                onClick={col.sortable && (() => handleSort(col.value))}
              >
                {col.name}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!!modifiedData.length &&
            modifiedData.map((row: any, i: number) => (
              <Table.Row key={`${row[columnList[0].value]}-${i}`}>
                {columnList.map((col: Column) => (
                  <Table.Cell key={`${i}-${col.value}`}>
                    {col.render
                      ? col.render(row, i)
                      : col.format
                      ? col.format(row[col.value])
                      : row[col.value]}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
        </Table.Body>
      </Table>

      {!modifiedData.length && (
        <Segment secondary padded textAlign="center">
          {emptyMsg}
        </Segment>
      )}
    </>
  );
};

export default MainTable;
