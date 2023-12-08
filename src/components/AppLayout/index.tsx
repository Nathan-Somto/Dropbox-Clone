import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header";
import { AuthContext, useAuth } from "@/hooks/useAuth";

function AppLayout() {
  const {
    authState: { user, loading },
  } = useAuth() as AuthContext;
  const isLoggedIn = user !== null;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (loading && pathname.includes("dashboard")) {
    return (
      <div className="h-screen w-full z-[9999] backdrop-blur-md flex justify-center items-center">
        <div className="rounded-full h-10 w-10 animate-spin border-t-transparent  border-2 border-blue-500"></div>
      </div>
    );
  }
  if (!isLoggedIn && pathname.includes("dashboard")) {
    navigate("/");
  }

  return (
    <>
      <Header />
      <main className="mt-14">
        <Outlet />
      </main>
    </>
  );
}
export default AppLayout;
