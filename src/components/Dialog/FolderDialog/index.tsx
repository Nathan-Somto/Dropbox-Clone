import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/config/firebase";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { FolderIcon } from "lucide-react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth, AuthContext } from "@/hooks/useAuth";
import { FolderType } from "@/index";
import { toast } from "@/components/ui/use-toast";
import { type TableDataContext, useTableData, FileOrFolderType } from "@/hooks/useTableData";
const MAX_STORAGE_SIZE = 200_000_000;
function FolderDialog() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { folderId } = useParams();
  const {tableState: {storageSize},updateData} = useTableData() as unknown as TableDataContext
  const disableButton = storageSize >= MAX_STORAGE_SIZE;
  const {
    authState: { user },
  } = useAuth() as unknown as AuthContext;
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
    try {
      if (user === null) throw new Error("user is not logged in!");
      const foldersCollectionRef = collection(db, "folders");
      const folderDetails: FolderType = {
        name: input,
        parentId: folderId ?? null,
        timestamp: serverTimestamp(),
        size: 0,
        type: "folder",
        userId: user.uid
      };
      const folderCreated = await addDoc(foldersCollectionRef, folderDetails);
    //@ts-ignore
     folderDetails.timestamp = new Date();
     (folderDetails as FileOrFolderType).id = folderCreated.id;
     //update the table state.
      updateData(folderDetails as FileOrFolderType);
      setOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Failed to Sign in",
          description: err.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={() => setOpen((prevState) => !prevState)}>
      <DialogTrigger asChild>
        <Button disabled={disableButton} className="bg-[#2b2929]  hover:opacity-50 font-semibold text-sm text-white dark:text-black flex px-2 dark:bg-white">
          <FolderIcon className="mr-1 h-5 w-5" />
          <span> Create Folder</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] min-h-[6rem]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="mb-4 text-2xl">New folder</DialogTitle>
            <Input
              id="link"
              onChange={(e) => setInput(e.target.value)}
              onKeyDownCapture={(e) => {
                if (e.key === "Enter") {
                  if (buttonRef.current !== null) {
                    buttonRef.current.click();
                  }
                }
              }}
            ></Input>
          </DialogHeader>

          <DialogFooter className="flex space-x-2 py-3">
            <Button
              ref={buttonRef}
              type="submit"
              size="sm"
              disabled={loading}
              className="px-3 flex-1"
            >
              {loading ? (
                <div className="border-t-transparent border h-5 w-5 mx-auto rounded-full border-white/80 animate-spin dark:border-black/80"></div>
              ) : (
                <>
                  <span className="sr-only">Create Folder</span>
                  <span>Create Folder</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default FolderDialog;
