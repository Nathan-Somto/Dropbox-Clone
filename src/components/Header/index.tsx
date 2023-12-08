import { MoonIcon, SunIcon } from "lucide-react";
import { Link } from "react-router-dom";
import dropboxLogo from "@/assets/dropboxLogo.svg";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";
import ProfileBox from "../ProfileBox";
import {useAuth, AuthContext} from "@/hooks/useAuth";

function Header() {
  const {setTheme} = useTheme()
  const {authState: {user}} = useAuth() as unknown as  AuthContext
  const hasLoggedIn = user !== null
  return (
    <nav className="h-14 z-[999999] bg-white border-b border-solid dark:bg-[hsl(var(--background))] dark:text-white py-3  px-6 flex items-center justify-between inset-0 fixed">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-[#0160fe]">

        <img
          src={dropboxLogo}
          className="w-10 h-10 object-contain rounded-md"
          alt="dropbox logo"
        />
        </div>

        <h1 className="text-2xl font-bold">DropBox</h1>
      </Link>
      <ul className="flex items-center gap-6">
        <li className="text-gray-500 hover:text-gray-900 text-lg cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-8">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        <li className="text-gray-500 hover:text-gray-900 text-lg cursor-pointer">
          {hasLoggedIn ? (
            <ProfileBox/>
          ) : (
            <Link to="/sign-in">Sign in</Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
export default Header;
