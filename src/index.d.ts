import { FieldValue } from "firebase/firestore"
// Similar to schema definition in firestore
type FileType = {
    name: string;
    size: number;
    timestamp: Date | FieldValue;
    downloadUrl: string;
    parentId: string | null;
    type: string;
    userId: string;

}
type FolderType = {
    name: string;
    parentId: string | null;
    timestamp: Date | FieldValue;
    size: number;
    type: "folder";
    userId: string;
}
type UserType = {
    name: string;
    profilePhoto: string;
    email: string;
}