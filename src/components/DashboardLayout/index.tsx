import TableDataProvider from "@/hooks/useTableData";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
    return (
      <TableDataProvider>
        <section className="px-6 pb-8">
       <Outlet/>
        </section>
      </TableDataProvider>
    );
  }
  export default DashboardLayout;