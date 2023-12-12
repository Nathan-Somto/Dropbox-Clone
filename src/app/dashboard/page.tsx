import { useEffect, useState } from "react";
import FolderDialog from "@/components/Dialog/FolderDialog";
import UploadDialog from "@/components/Dialog/UploadDialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircleIcon, ChevronLeft, Cloud } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
//import { v4 as uuidv4 } from "uuid";
import {
  useTableData,
  TableDataContext,
  FileOrFolderType,
} from "@/hooks/useTableData";
import { columns } from "@/components/Table/columns";
import { DataTable } from "@/components/Table/data-table";
import clsx from "clsx";
import prettyBytes from "pretty-bytes";
import SkeletonLoader from "@/components/Table/skeleton-loader";
import { useAuth, type AuthContext } from "@/hooks/useAuth";
import {
  FieldValue,
  and,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { FileType, FolderType } from "@/index";
import SortDropdown from "@/components/SortDropdown";
type FolderPathType = {
  folderName: string;
  folderLink: string;
  folderId: string;
};
/* const sampleData: FileOrFolderType[] = [
  {
    id: uuidv4(),
    name: "my pdf document",
    downloadUrl: "https://www.pdf.com",
    size: 123454,
    parentId: null,
    timestamp: new Date(),
    type: "type/pdf",
  },
  {
    id: uuidv4(),
    name: "my word document",
    downloadUrl: "https://www.docx.com",
    size: 3245679,
    parentId: null,
    timestamp: new Date(),
    type: "type/docx",
  },
  {
    id: uuidv4(),
    name: "my first folder",
    size: 1_203_345_098_0,
    parentId: null,
    timestamp: new Date(),
    type: "folder",
  },
  {
    id: uuidv4(),
    name: "my first folder",
    size: 12033450980,
    parentId: null,
    timestamp: new Date(),
    type: "folder",
  },
  {
    id: uuidv4(),
    name: "my powerpoint",
    downloadUrl: "https://www.mypptx.com",
    size: 129304895,
    parentId: null,
    timestamp: new Date(),
    type: "type/pptx",
  },
]; */
type FolderDocData = FolderType & { timestamp: FieldValue };
type FileDocData = FileType & { timestamp: FieldValue };
function DashboardPage() {
  const { id, folderId } = useParams();
  const {
    authState: { user },
  } = useAuth() as unknown as AuthContext;
  const [folderPath, setFolderPath] = useState<FolderPathType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    storeFiles,
    tableState: { tableData, storageSize },
  } = useTableData() as unknown as TableDataContext;
  async function fetchData(folderId?: string) {
    setLoading(true);
    const data: FileOrFolderType[] = [];
    try {
      if(user === null) throw new Error("user is not logged in");
      const q1 = query(
        collection(db, "folders"),
        and(where("parentId", "==", folderId ?? null), where("userId", "==", user.uid))
      );
      const folders = await getDocs(q1);
      folders.docs.forEach((doc) => {
        const docData = doc.data() as unknown as FolderDocData;
        data.push({
          ...docData,
          //@ts-ignore
          timestamp: new Date(docData.timestamp?.seconds * 1000) || new Date(),
          id: doc.id,
        });
      });
      const q2 = query(
        collection(db, "files"),
        and(where("parentId", "==", folderId ?? null), where("userId", "==", user.uid))
      );
      const files = await getDocs(q2);
      files.docs.forEach((doc) => {
        const docData = doc.data() as unknown as FileDocData;
        data.push({
          ...docData,
          //@ts-ignore
          timestamp: new Date(docData.timestamp?.seconds * 1000) || new Date(),
          id: doc.id,
        });
      });
      storeFiles(data, typeof folderId === "undefined");
    } catch (err) {
      setError(true);
      console.error("error thrown in fetchData function");
      if (err instanceof Error) {
        console.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (user?.uid !== id) {
      navigate("/");
    }
    // fetch folders and files from db
    fetchData(folderId);
    if (folderPath.at(-1)?.folderId !== folderId) {
      determineFolderPath("first folder");
    }
  }, [folderId]);
  function determineFolderPath(name: string) {
    // if i am in the root dir folderPath -> []
    if (typeof folderId !== "undefined") {
      // if i am in folderPath and  i am not top of the stack  remove all paths in front of me.
      // e.g /root/folder1/folder2/folder3/folder4  and i click folder2
      // note, the top of the stack is the current folder i.e /root/folder1/folder2 that is folder2
      let position = folderPath
        .slice(0, -1)
        .findIndex((item) => item.folderId === folderId);
      console.log("the position of  id:", position, folderId);
      if (position !== -1) {
        setFolderPath(folderPath.slice(0, position + 1));
      }
      // if folderPath is empty add me to the top of stack.
      // e.g /root and i enter /folder1 -> /root/folder1
      // if i am not in folderPath and it has paths add me to the top.
      // e.g /root/folder1/  and i enter /folder2 -> /root/folder1/folder2
      else {
        setFolderPath((prevState) => [
          ...prevState,
          {
            folderName: name,
            folderId,
            folderLink: `/dashboard/${id}/folders/${folderId}`,
          },
        ]);
      }
    } else {
      // when the user clicks directly on the root link and folderPath is not empty
      if (folderPath.length !== 0) {
        setFolderPath([]);
      }
    }
  }
  if (error) {
    return (
      <div className="flex h-[calc(100vh-20*0.25rem)] justify-center items-center flex-col gap-4">
        <AlertCircleIcon
          size="36"
          className="text-gray-700 dark:text-gray-400"
        />
        <div>
          <h2 className="text-2xl font-semibold">
            Something Unexpected happened!
          </h2>
          <p className="test-sm text-gray-700 mt-2 dark:text-gray-400">
            Please try retrying the app or check your connection!
          </p>
          <Button
            onClick={() => navigate(location.pathname, {
              replace: true
            })}
            size="lg"
            variant={"secondary"}
            className="mt-3"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* new file, new folder, file limit */}

      {loading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div className="flex flex-col gap-7  sm:flex-row sm:justify-between mt-24">
            <div className="flex space-x-8 items-center">
              <Button
                onClick={() => navigate(-1)}
                variant="link"
                className="!px-0 hover:-translate-x-2 transition-all delay-75 duration-200 ease-in"
              >
                <ChevronLeft size="26" />
              </Button>
              <UploadDialog />
              <FolderDialog />
            </div>
            <div className="min-w-[200px]">
              <p className="font-semibold flex items-center space-x-2 text-lg mb-3">
                <Cloud />
                <span>Storage</span>
              </p>
              <Progress
                value={
                  (storageSize / 200_000_000) * 100 >= 100
                    ? 100
                    : (storageSize / 200_000_000) * 100
                }
                className="h-2 rounded-sm max-w-[300px] "
                indicatorBackground={storageSize >= 200_000_000}
              />
              <small className="text-xs text-muted-foreground font-medium">
                {" "}
                {prettyBytes(storageSize)} of {prettyBytes(200_000_000)} used
              </small>
            </div>
          </div>
          <div className="flex w-full sm:justify-between gap-5 sm:gap-0  my-12 flex-col sm:items-center sm:flex-row">
            {/* Folder Path */}
            <div>
              <p className="text-xl font-semibold">Path</p>
              <div className="max-w-[200px] mt-2 flex flex-wrap">
                <Link
                  className={clsx({
                    "font-medium hover:opacity-80": true,
                    " dark:text-[whitesmoke] text-black/80 font-semibold ":
                      folderPath.length === 0,
                    "underline text-blue-500 dark:text-blue-800":
                      folderPath.length !== 0,
                  })}
                  to={`/dashboard/${id}`}
                >
                  root
                </Link>
                {folderPath.map(
                  ({ folderId, folderName, folderLink }, index) => (
                    <Link
                      key={folderId}
                      to={folderLink}
                      className={clsx({
                        "font-medium hover:opacity-80": true,
                        "font-semibold dark:text-[whitesmoke] text-black/80":
                          index === folderPath.length - 1,
                        "[&_span:nth-child(2)]:underline text-blue-500 dark:text-blue-800":
                          index !== folderPath.length - 1,
                      })}
                    >
                      <span className="text-lg text-gray-500 dark:text-gray-600 mx-2">
                        {"/"}
                      </span>
                      <span>{folderName}</span>
                    </Link>
                  )
                )}
              </div>
            </div>
            <SortDropdown folderId={folderId} />
          </div>
          {/* Table */}
          <div className="rounded-md border border-gray-500 dark:border-gray-600">
            <DataTable data={tableData} columns={columns} />
          </div>
        </>
      )}
    </>
  );
}
export default DashboardPage;
