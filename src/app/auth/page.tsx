import lightBg from "@/assets/light-bg.png";
import darkBg from "@/assets/dark-bg.png";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import Google from "@/assets/google.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { useAuth, AuthContext } from "@/hooks/useAuth";
import { UserType } from "@/index";
const MAX_SIZE = 5;
function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { setAuthState, authState: {user} } = useAuth() as unknown as AuthContext;
  const navigate = useNavigate();
  useEffect(() => {
    if(user !== null){
      navigate(`/dashboard/${user.uid}`);
    }
  }, [user])
  async function checkForUserLimit() {
    const userSnapshot = await getDocs(collection(db, "users"));
    return userSnapshot.docs.length === MAX_SIZE;
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const isMax = await checkForUserLimit();
      if (isMax) throw new Error("Reached maximium number of users");
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", cred.user.uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        setAuthState((prevState) => ({
          ...prevState,
          user: cred.user,
        }));
      } else {
        const userData: UserType = {
          email: cred.user.email as string,
          name: cred.user.displayName as string,
          profilePhoto: cred.user.photoURL as string,
        };
        await setDoc(userRef, userData);
      }
      navigate(`/dashboard/${cred.user.uid}`);
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Failed to Sign in",
          description: err.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex h-[calc(100vh-64px)] dark:bg-slate-800 py-4 lg:py-12 px-8  justify-center w-full flex-col lg:flex-row dark:text-white">
      <form onSubmit={handleSubmit} className="self-center mx-auto text-center">
        <div className="">
          <h1 className="text-6xl mb-3 font-bold"> Hi There!</h1>
          <p className="text-muted-foreground font-medium">
            Your Journey Begins Here
          </p>
        </div>
        <Button
          size="lg"
          disabled={isLoading}
          className="py-6 mx-auto mt-7 font-bold items-center text-white flex dark:bg-[#0160fe]/60 bg-[#0160fe]"
        >
          {" "}
          {isLoading ? (
            <div className="border-t-transparent h-5 w-5 mx-auto border rounded-full border-white/80 animate-spin "></div>
          ) : (
            <>
              <img src={Google} alt="google logo" className=" mr-3 h-7 " />{" "}
              Continue with Google
            </>
          )}
        </Button>
        <p className="mx-auto mt-6 text-center text-sm w-[80%] text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            to="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
      <figure className="h-full hidden lg:block mx-auto lg:max-h-full max-h-[250px] max-w-[550px] rounded-lg overflow-hidden">
        {theme === "dark" ? (
          <img
            className="h-full lg:scale-[1.25] object-contain lg:object-cover"
            src={darkBg}
            alt="dropbox 2d illustration for dark mode"
          />
        ) : (
          <img
            className="h-full lg:scale-[1.25] object-contain lg:object-cover"
            src={lightBg}
            alt="dropbox 2d illustration for light mode"
          />
        )}
      </figure>
    </div>
  );
}
export default AuthPage;
