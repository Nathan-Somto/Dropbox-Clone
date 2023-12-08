import { LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import  {useAuth, AuthContext} from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
function ProfileBox() {
  const {authState: {user}, setAuthState} = useAuth() as unknown as  AuthContext
  const navigate = useNavigate();
  async function handleLogout() {
    try{
      await signOut(auth);
      setAuthState(prevState => ({
        ...prevState,
        user:null
      }));
      navigate("/");
    }
    catch(err){
      console.error(err);
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="!ring-none">
        <img
          src={user?.photoURL ?? ""}
          alt="user profile image"
          className="h-10 w-10 rounded-full border border-solid object-cover"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="shadow-lg !min-h-[10rem] flex flex-col justify-center dark:bg-slate-800/50 px-5 mt-10 rounded-xl"
        align="end"
      >
        <DropdownMenuItem className="flex !hover:bg-transparent gap-3">
          <img
            src={user?.photoURL ?? ""}
            alt="user profile image"
            className="h-14 w-14 rounded-full border border-solid object-cover"
          />
          <div>
            <p className="font-bold text-[17.5px] mb-2">{user?.email ?? ""}</p>
            <p>{user?.displayName ?? ""}</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button variant={"ghost"} onClick={handleLogout} className="gap-3">
            <LogOutIcon />
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ProfileBox;
