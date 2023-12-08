import { FieldValue } from "firebase/firestore"
// Similar to schema definition in firestore
type FileType = {
    name: string;
    size: number;
    timestamp: Date | FieldValue;
    downloadUrl: string;
    parentId: string | null;
    type: string;

}
type FolderType = {
    name: string;
    parentId: string | null;
    timestamp: Date | FieldValue;
    size: number;
    type: "folder"
}
type UserType = {
    name: string;
    profilePhoto: string;
    email: string;
}