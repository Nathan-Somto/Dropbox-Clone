import { initializeApp  } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import {getFirestore} from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyBt-C42-0mZKhRivm8YpuZLrW8I32ytIqc",
  authDomain: "dropbox-clone-e4cd0.firebaseapp.com",
  projectId: "dropbox-clone-e4cd0",
  storageBucket: "dropbox-clone-e4cd0.appspot.com",
  messagingSenderId: "391500104860",
  appId: "1:391500104860:web:ca6c61253318a43f461959"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
export {
    auth,
    storage,
    db
};