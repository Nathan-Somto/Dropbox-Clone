import { FileOrFolderType } from "@/hooks/useTableData";
import { FileType } from "@/index";
import { ColumnDef } from "@tanstack/react-table";
import { FolderOpenIcon } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { DefaultExtensionType, FileIcon, defaultStyles } from "react-file-icon";
import { Link, useParams } from "react-router-dom";

export const columns: ColumnDef<FileOrFolderType>[] = [
  {
    accessorKey: "type",
    header: "type",
    cell: ({ renderValue, row }) => {
      const isFolder = renderValue() === "folder";
      let extension = "";
      if (!isFolder) {
        extension = row.original.name?.split(".")[1];
      }
      return (
        <div className="w-9">
          {isFolder ? (
            <FolderOpenIcon className="h-9 dark:text-gray-400 text-gray-700 w-9" />
          ) : (
            <FileIcon
              extension={extension}
              {...defaultStyles[extension as DefaultExtensionType]}
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ renderValue, row }) => {
      const {id} = useParams();
      const link =
        row.original.type === "folder"
          ? `/dashboard/${id}/folders/${row.original.id}`
          : `${(row.original as FileType).downloadUrl}`;
      const className =
        "underline text-blue-500 hover:opacity-70 transition-all delay-150 ease-in duration-250";
      return row.original.type === "folder" ? (
        <Link to={link} className={className}>
          {renderValue() as string}
        </Link>
      ) : (
        <a href={link} className={className} target="_blank">
          {renderValue() as string}
        </a>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ renderValue }) => (
      <span>{prettyBytes(renderValue() as number)}</span>
    ),
  },
  {
    accessorKey: "timestamp",
    header: "Date Added",
    cell: ({ renderValue }) => {
      return(
      <>
        <p className="text-sm mb-[0.15rem]">
          {(renderValue() as Date).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-500">
          {(renderValue() as Date).toLocaleTimeString()}
        </p>
      </>);
    },
  },
];
