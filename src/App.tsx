import { Route, Routes } from "react-router-dom";
import Home from "@/app/home/page";
import Dashboard from "@/app/dashboard/page";
import Auth from "@/app/auth/page";
import AppLayout from "./components/AppLayout";
import DashboardLayout from "./components/DashboardLayout";
function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="dashboard/:id" element={<DashboardLayout/>}>
          <Route index element={<Dashboard />} />
          <Route path="folders/:folderId" element={<Dashboard />} />
        </Route>
        <Route path="sign-in" element={<Auth />} />
      </Route>
    </Routes>
  );
}

export default App;
