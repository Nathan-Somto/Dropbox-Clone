import {
  DownloadIcon,
  MoreHorizontal,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DeleteDialogType, RenameDialogType } from "./data-table";
type Props = {
  openRenameDialog: (options: Omit<RenameDialogType, "open">) => void;
  openDeleteDialog: (options: Omit<DeleteDialogType, "open">) => void;
  id: string;
  name: string;
  type: "folder" | "file";
  downloadUrl?: string;
  size: number;
};
function Actions({
  openRenameDialog,
  openDeleteDialog,
  id,
  name,
  type,
  downloadUrl,
  size,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() =>
            openDeleteDialog({
              id,
              name,
              size,
              type,
            })
          }
          className="text-red-500 flex items-center space-x-2"
        >
          <TrashIcon size={16} /> <span>Delete {type}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            openRenameDialog({
              id,
              name,
              type,
            })
          }
          className="dark:text-gray-400 text-black/80 flex items-center space-x-2"
        >
          <PencilIcon size={16} /> <span>Edit {type}</span>
        </DropdownMenuItem>
        {type === "file" && (
          <DropdownMenuItem>
            <a
              href={`${downloadUrl}`}
              download={name}
              className="dark:text-gray-400 text-black/80 flex items-center space-x-2"
              target="_blank"
            >
              <DownloadIcon size={16} /> <span>Download</span>
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default Actions;
