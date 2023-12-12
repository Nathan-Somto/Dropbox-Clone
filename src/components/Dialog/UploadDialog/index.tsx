import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import clsx from "clsx";
import {
  AlertCircle,
  ArrowBigDownDash,
  FileBoxIcon,
  UploadCloudIcon,
  X,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import prettyBytes from "pretty-bytes";
import {
  serverTimestamp,
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  UploadTask,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage, db } from "@/config/firebase";
import { useParams } from "react-router-dom";
import { FileType, FolderType } from "@/index";
import { useAuth, type AuthContext } from "@/hooks/useAuth";
import {
  type TableDataContext,
  useTableData,
  FileOrFolderType,
} from "@/hooks/useTableData";
const MAX_SIZE = 10_485_760;
const MAX_STORAGE_SIZE = 200_000_000;
type FileInfoType = {
  name: string;
  id: string;
  size: string;
};
type UploadProgressType = {
  [index: string]: number;
};
type UploadTaskType = {
  [index: string]: UploadTask;
};
type UploadFailedType = {
  [index: string]: boolean;
};
function UploadDialog() {
  const [disabled, setDisabled] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfoType[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType>({});
  const [uploadFailed, setUploadFailed] = useState<UploadFailedType>({});
  const uploadTasksRef = useRef<UploadTaskType>({});
  const { folderId } = useParams();
  const {
    authState: { user },
  } = useAuth() as unknown as AuthContext;
  const {
    tableState: { storageSize },
    updateData,
  } = useTableData() as unknown as TableDataContext;
  const disableButton = storageSize >= MAX_STORAGE_SIZE;
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (fileInfo.length === 2) return;
      acceptedFiles.slice(0, 2).forEach((file) => {
        const reader = new FileReader();
        const formattedName =
          file.name.length < 12
            ? file.name
            : file.name.substring(0, 7) + "..." + file.name.split(".").at(-1);
        const fileId = uuidv4();
        setFileInfo((prevState) => [
          ...prevState,
          { name: formattedName, id: fileId, size: prettyBytes(file.size) },
        ]);
        setUploadProgress((prevState) => ({
          ...prevState,
          [fileId]: 0,
        }));
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = async () => {
          try {
            if (user === null) throw new Error("user is not logged in!");
            const fileDetails: FileType = {
              name: file.name,
              size: file.size,
              timestamp: serverTimestamp(),
              downloadUrl: "",
              parentId: folderId ?? null,
              type: file.type,
              userId: user.uid
            };
            // store file in firestore
            const filesCollectionRef = collection(db, "files");
            const fileCreated = await addDoc(filesCollectionRef, fileDetails);
            // upload file to firebase storage and get downloadUrl
            const binaryStr = reader.result;
            const downloadUrl = await uploadFile(binaryStr as ArrayBuffer, {
              storageFileId: fileCreated.id,
              fileId,
            });
            await updateDoc(doc(db, "files", fileCreated.id), {
              downloadUrl,
            });
            // update folder size in firestore if adding to a folder
            if (folderId) {
              const folderDocRef = doc(db, "folders", folderId);
              const folderSnapshot = await getDoc(folderDocRef);
              if (folderSnapshot.exists()) {
                const currentSize =
                  (folderSnapshot.data() as Partial<FolderType>)?.size ?? 0;
                const newSize = currentSize + file.size;
                await updateDoc(folderDocRef, {
                  size: newSize,
                });
              }
            }
            fileDetails.downloadUrl = downloadUrl ?? "";
            fileDetails.timestamp = new Date();
            (fileDetails as FileOrFolderType).id = fileCreated.id;
            updateData(fileDetails as unknown as  FileOrFolderType);
          } catch (err) {
            setUploadFailed((prevState) => ({
              ...prevState,
              [fileId]: true,
            }));
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [fileInfo.length]
  );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    isDragReject,
  } = useDropzone({ onDrop, maxFiles: 2, maxSize: MAX_SIZE });

  const isFileTooLarge = useMemo(
    () => fileRejections.length > 0 && fileRejections[0].file.size > MAX_SIZE,
    [fileRejections]
  );
  /**
   *
   * @param file the file you wish to upload
   * @param options the storageFileId is used to determine where to store the file, the fileId is used to monitor the currently uploading file.
   * @returns a String or  undefined
   * @description handles the upload of a particular file to firebase storage and returns a download url when finished.
   */
  async function uploadFile(
    file: ArrayBuffer,
    { storageFileId, fileId }: { storageFileId: string; fileId: string }
  ) {
    console.log("in upload file");
    if (disabled) return;
    setDisabled(true);
    try {
      if (user === null) throw new Error("user not logged in");
      const storageRef = ref(
        storage,
        `users/${user.uid}/files/${storageFileId}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTasksRef.current[fileId] = uploadTask;
      uploadTask.on("state_changed", (snapshot) => {
        console.log("state changed");
        // calculate progress percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // update the progess
        setUploadProgress((prevState) => ({
          ...prevState,
          [fileId]: +progress.toFixed(1),
        }));
      });
      // upload and get the download url
      const snapshot = await uploadTask;
      return await getDownloadURL(snapshot.ref);
    } catch (err) {
      console.error("error uploading file");
      setUploadFailed((prevState) => ({ ...prevState, [fileId]: true }));
      return "";
    } finally {
      setDisabled(false);
    }
  }
  function stopUploadingFile(id: string) {
    // stop the upload to firebase
    const uploadTask = uploadTasksRef.current[id];
    uploadTask.cancel();
    // remove from the ui
    setFileInfo(fileInfo.filter((info) => info.id !== id));
    // remove the progess
    // remove the ref
    delete uploadTasksRef.current[id];
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={disableButton}
          className="bg-[#2b2929] hover:opacity-50 font-semibold text-sm text-white dark:text-black flex justify-between px-3 dark:bg-white"
        >
          <FileBoxIcon className="mr-1 h-5 w-5" /> <span>Upload File</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[350px] overflow-auto !bg-[hsl(var(--primary-foreground))]">
        <DialogHeader
          {...getRootProps({
            className: clsx({
              "h-[200px] border my-6 border-dashed w-full flex flex-col gap-3 justify-center items-center":
                true,
              "bg-[#0160fe] text-white animate-pulse":
                isDragActive && !isDragReject,
              "bg-red-800 text-white": isFileTooLarge || isDragReject,
            }),
          })}
        >
          <input {...getInputProps()} />

          {isFileTooLarge || isDragReject ? null : isDragActive ? (
            <>
              <ArrowBigDownDash
                size="85"
                color="white"
                className="animate-bounce"
              />
              <span>Drop Files here!</span>
            </>
          ) : (
            <>
              <UploadCloudIcon size="85" color="#0160fe" />
              <span>Drag n Drop a file or click to upload</span>
              <em className="text-sm text-muted-foreground">
                Maximium number of files allowed (2) size (10mb){" "}
              </em>
            </>
          )}
          {(isFileTooLarge || isDragReject) && (
            <AlertCircle size="85" color="white" className="animate-ping" />
          )}
          {isFileTooLarge && <span>The File is Too large, please stop</span>}
          {isDragReject && (
            <span>Failed to accept the files for some reason</span>
          )}
        </DialogHeader>
        <div className="h-[250px] overflow-y-auto">
          {fileInfo.length > 0
            ? fileInfo.map((info) => (
                <div
                  key={info.id}
                  className="rounded-md my-3 px-3 py-6 relative border border-solid"
                >
                  <div className="flex space-x-4 mb-3">
                    <p className="font-semibold">{info.name}</p>
                    <p className="text-sm text-muted-foreground">{info.size}</p>
                  </div>
                  {/* If upload failed show failed, 
                  if the progress is still updating show cancel button and progress bar, 
                  else show complete */}
                  {uploadFailed[info.id] ? (
                    <p className="text-red-500 text-sm font-medium">Failed!</p>
                  ) : uploadProgress[info.id] !== 100 ? (
                    <>
                      <Button
                        onClick={() => stopUploadingFile(info.id)}
                        variant="ghost"
                        className="absolute  top-[0.45rem]  right-[0.355rem] z-[3]"
                      >
                        <X size="20" color="gray" />
                      </Button>
                      <Progress
                        value={uploadProgress[info.id]}
                        className="h-2 rounded-md"
                      />
                    </>
                  ) : (
                    <p className="text-green-500 text-sm font-medium">
                      Complete!
                    </p>
                  )}
                </div>
              ))
            : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default UploadDialog;
