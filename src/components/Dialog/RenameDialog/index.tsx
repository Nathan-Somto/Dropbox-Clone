import { RenameDialogType } from "@/components/Table/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  FileOrFolderType,
  TableDataContext,
  useTableData,
} from "@/hooks/useTableData";
import { doc, updateDoc } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { db } from "@/config/firebase";
import { toast } from "@/components/ui/use-toast";
type Props = RenameDialogType & {
  setDialogState: React.Dispatch<React.SetStateAction<RenameDialogType>>;
};
function RenameDialog({ name, id, setDialogState, type, open }: Props) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const fileExtensionRef = useRef<string>("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { editName } = useTableData() as unknown as TableDataContext;
  useEffect(() => {
    setInput(name.split(".")[0]);
    fileExtensionRef.current = name.split(".")[1];
  }, [name]);
  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
  // this check is done to preserve the file extension.
    let newName =
        type === "folder"
          ? input
          : input === input + fileExtensionRef.current
          ? input
          : input + (fileExtensionRef.current !== undefined ? "." + fileExtensionRef.current : "");
    try {
      const fileOrFolderDetails: Pick<FileOrFolderType, "name"> = {
        name: newName,
      };
      // perform the firestore update.
      await updateDoc(doc(db, type.concat("s"), id), fileOrFolderDetails);
      // update the ui
      editName(newName, id);
      // close the modal
      toggleOpen();
    } catch (err) {
      let message = `failed to edit ${name} to ${input} `;
      toggleOpen();
      setTimeout(() => {
        toast({
          title: "Failed",
          description: message,
          variant: "destructive",
        });
      }, 1000);
    } finally {
      setLoading(false);
    }
  }
  function toggleOpen() {
    setDialogState((prevState) => ({
      ...prevState,
      open: false,
    }));
  }
  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent className="sm:max-w-[425px] min-h-[6rem]">
        <form onSubmit={handleEdit}>
          <DialogHeader>
            <DialogTitle className="mb-4 text-2xl">
              Rename {type[0].toUpperCase() + type.slice(1)}
            </DialogTitle>
            <Input
              id="name"
              value={input}
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
              size="sm"
              className="px-3 flex-1"
              type="button"
              onClick={toggleOpen}
            >
              <span className="sr-only">Cancel</span>
              <span>Cancel</span>
            </Button>
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
                  <span className="sr-only">Save</span>
                  <span>Save</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default RenameDialog;
