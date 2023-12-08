import React, { createContext, useContext, useReducer } from "react";
import { FileType, FolderType } from "..";
export type FileOrFolderType = ({
  [P in keyof FileType ]: FileType[P]; 
} | {
  [P in keyof FolderType]: FolderType[P];
}) & {id: string}
export type TableDataType = FileOrFolderType[];
export type TableDataContext = {
  tableState: TableState;
  storeFiles: (tableData: TableDataType, isRoot: boolean) => void;
  editName: (name: string, id: string) => void;
  deleteData: (id: string) => void;
  updateData: (data: FileOrFolderType) => void;
};
const TableData = createContext<TableDataContext | null>(null);

type TableState = {
  storageSize: number;
  tableData: TableDataType;
};
type Action =
  | { type: "Edit/name"; payload: { tableData: TableDataType } }
  | {
      type: "Delete/data";
      payload: { tableData: TableDataType; storageSize: number };
    }
  | {
      type: "Set/data";
      payload: { tableData: TableDataType; storageSize: number };
    }
  | {
      type: "Update/data";
      payload: { tableData: TableDataType; storageSize: number };
    };

function reducer(state: TableState, action: Action) {
  switch (action.type) {
    // handle  storing data for table
    // handle deletion of data for table
    // handle adding of new files
    case "Set/data":
    case "Delete/data":
    case "Update/data":
      return {
        ...state,
        tableData: action.payload.tableData,
        storageSize: action.payload.storageSize,
      };

    // handle editing new files name
    case "Edit/name":
      return {
        ...state,
        tableData: action.payload.tableData,
      };
    default:
      return { ...state };
  }
  // calculate storage limit.
}
type ReducerType = (state: TableState, action: Action) => TableState;
function TableDataProvider({ children }: { children: React.ReactNode }) {
  const initialTableState: TableState = {
    tableData: [],
    storageSize: 0,
  };

  const [tableState, dispatch] = useReducer<ReducerType>(reducer, initialTableState);
  function storeFiles(tableData: TableDataType, isRoot: boolean) {
    const storageSize = isRoot ? calculateStorageSize(tableData) : tableState.storageSize;
    dispatch({ type: "Set/data", payload: { tableData, storageSize } });
  }
  function calculateStorageSize(tableData: TableDataType) {
    return tableData.reduce((acc, curr) => acc + curr.size, 0);
  }
  function editName(name: string, id: string) {
    const tableData = tableState.tableData.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          name,
        };
      }
      return item;
    });
    dispatch({ type: "Edit/name", payload: { tableData } });
  }
  function deleteData(id: string) {
    const tableData = tableState.tableData.filter((item) => item.id !== id);
    const storageSize = calculateStorageSize(tableData);
    dispatch({ type: "Delete/data", payload: { tableData, storageSize } });
  }
  function updateData(data: FileOrFolderType) {
    const tableData = [data, ...tableState.tableData];
    const storageSize = calculateStorageSize(tableData);
    dispatch({ type: "Update/data", payload: { tableData, storageSize } });
  }
  return (
    <TableData.Provider
      value={{
        tableState,
        storeFiles,
        editName,
        deleteData,
        updateData,
      }}
    >
      {children}
    </TableData.Provider>
  );
}
export function useTableData() {
  return useContext(TableData);
}
export default TableDataProvider;
