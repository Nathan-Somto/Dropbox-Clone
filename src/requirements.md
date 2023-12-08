# Requirements
 The sample requirements for the dropbox clone.

## Features
- As a user i should be able to log in with my google account.
- As a user i should be able to see a table in my dashboard containing all my files.
- As a user i should be able to see a loading skeleton when data is being fetched.
- As a user i should be able to see the progress of each file as it is uploading.
- As  a user i should be able to see an upload limit progress Bar (Max of 200MB per User)
- As a user i should be able to upload a file through drag n drop
- As a user i should be able to see the contents of folders
- As a user i should be able to edit and delete files and folders.
- As a User i should be able to click a file and it will be downloaded.

## Database Schema

collections/
- users/
  - {userId}/
    - name : "User's Name"
    - email: "User's email"
    - profilePhoto: "User's photo"
- folders/
    - {folderId}/
      - name: "Folder Name"
      - parentId: "parentFolderId" (null for root folders)
      - createdBy: "userId"
      - size: 0 (initial size)
- files/
    - {fileId}/
      - name: "File Name"
      - parentId: "folderId"
      - createdBy: "userId"
      - url: "fileUrl"
      - size: file size in bytes
