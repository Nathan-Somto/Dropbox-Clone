import type { DeleteDialogType } from "@/components/Table/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { db, storage } from "@/config/firebase";
import { type AuthContext, useAuth } from "@/hooks/useAuth";
import { TableDataContext, useTableData } from "@/hooks/useTableData";
import {
  FirestoreError,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { StorageError, deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
type Props = DeleteDialogType & {
  setDialogState: React.Dispatch<React.SetStateAction<DeleteDialogType>>;
};
function DeleteDialog({ id, open, setDialogState, type, name }: Props) {
  const { deleteData } = useTableData() as unknown as TableDataContext;
  const [loading, setLoading] = useState(false);
  const {
    authState: { user },
  } = useAuth() as unknown as AuthContext;
  console.log("in delete dialog", id,name)
  async function deleteFilesInFolder(folderId: string) {
    // drawback: code does not handle recursively deleting subfolders, deleting files from firebase storage
    // this was done intentionally to simplify this build.
    // if you would like to contribute you can come here.
    const filesQuery = query(
      collection(db, "files"),
      where("parentId", "==", folderId)
    );
    const filesSnapshot = await getDocs(filesQuery);
    const deleteFilePromises: Promise<void>[] = [];
    filesSnapshot.forEach((fileDoc) => {
      const fileId = fileDoc.id;
      deleteFilePromises.push(deleteDoc(doc(db, "files", fileId)));
    });
    return await Promise.all(deleteFilePromises);
  }
  async function handleDelete(id: string, type: DeleteDialogType["type"]) {
    setLoading(true);
    try {
      // if type is file delete file from firebase storage
      const isFolder = type === "folder";
      if (isFolder) {
        await deleteFilesInFolder(id);
        await deleteDoc(doc(db, "folders", id));
      } else {
        if(user === null) throw new Error("user not logged in");
        const storageRef = ref(storage, `users/${user.uid}/files/${id}`);
        await deleteObject(storageRef);
        await deleteDoc(doc(db, "files", id));
      }
      console.log(id, type);
      // delete from firestore
      // update the ui.
      deleteData(id);
      // close the modal
      toggleOpen();
      toast({
        title: `Succesfully deleted ${type}`,
        description: `${name} has been deleted!`,
      });
    } catch (err) {
      let message = "";
      if (err instanceof StorageError) {
        message += `failed to delete ${type} from storage!`;
      } else if (err instanceof FirestoreError) {
        message += `failed to delete ${type} from database!`;
      } else if (err instanceof Error) {
        message += err.message;
      }
      console.error(err);
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
      open: !prevState.open,
    }));
  }
  return (
    <Dialog open={open} onOpenChange={() => toggleOpen()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete!</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will Permanently delete your{" "}
            {type}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button size="sm" className="px-3 flex-1" onClick={toggleOpen}>
            <span className="sr-only">Cancel</span>
            <span>Cancel</span>
          </Button>
          <Button
            size="sm"
            className="px-3 flex-1"
            disabled={loading}
            variant={"destructive"}
            onClick={() => handleDelete(id, type)}
          >
            {loading ? (
              <div className="border-t-transparent border h-5 w-5 mx-auto rounded-full border-white/80 animate-spin dark:border-black/80"></div>
            ) : (
              <>
                <span className="sr-only">Delete</span>
                <span>Delete</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteDialog;
