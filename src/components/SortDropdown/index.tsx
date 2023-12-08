import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  FileOrFolderType,
  TableDataContext,
  useTableData,
} from "@/hooks/useTableData";
import { FileType, FolderType } from "@/index";
import React from "react";
type SortType = "asc" | "desc" | "files" | "folders";
type SortDataType = {
  id: string;
  text: string;
  sortOrder: SortType;
};
const sortData: SortDataType[] = [
  {
    id: uuidv4(),
    text: "Largest Size",
    sortOrder: "desc",
  },
  {
    id: uuidv4(),
    text: "Smallest Size",
    sortOrder: "asc",
  },
  {
    id: uuidv4(),
    text: "Folders",
    sortOrder: "folders",
  },
  {
    id: uuidv4(),
    text: "Files",
    sortOrder: "files",
  },
] as const;
type Props = {
  folderId?: string;
};
function SortDropdown({ folderId }: Props) {
  const [open, setOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortType>("folders");
  const {
    tableState: { tableData },
    storeFiles,
  } = useTableData() as unknown as TableDataContext;
  function splitFoldersAndFiles(
    folderAndFiles: FileOrFolderType[],
    order: "files" | "folders"
  ): FileOrFolderType[] {
    const folderArr: FolderType[] &
      { type: FileOrFolderType["type"]; id: string }[] = [];
    const filesArr: FileType[] & { id: string }[] = [];
    folderAndFiles.forEach((item) => {
      if (item.type === "folder") {
        folderArr.push(item);
      } else {
        filesArr.push(item as unknown as FileType & { id: string });
      }
    });
    return order === "files"
      ? [...filesArr, ...folderArr]
      : [...folderArr, ...filesArr];
  }
  function handleSort(sortType: SortType) {
    let sortedTableData = tableData.slice();
    switch (sortType) {
      case "asc":
        sortedTableData.sort((a, b) => a.size - b.size);
        break;
      case "desc":
        sortedTableData.sort((a, b) => b.size - a.size);
        break;
      case "files":
        sortedTableData = splitFoldersAndFiles(tableData, sortType);
        break;
      case "folders":
        sortedTableData = splitFoldersAndFiles(tableData, sortType);
        break;
      default:
        console.error("do you want to kill my app!");
    }
    setSortOrder(sortType);
    storeFiles(sortedTableData, typeof folderId === "undefined");
  }
  return (
    <DropdownMenu
      open={open}
      onOpenChange={() => setOpen((prevState) => !prevState)}
    >
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"} className=" max-w-fit">
          {" "}
         <span className="mr-1">Sort by{" "}</span> 
          {open ? <ChevronUp size={"18"} /> : <ChevronDown size={"18"} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortData.map((item) => (
          <React.Fragment key={item.id}>
            <DropdownMenuCheckboxItem
              checked={sortOrder === item.sortOrder}
              onClick={() => handleSort(item.sortOrder)}
            >
              {item.text}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default SortDropdown;
