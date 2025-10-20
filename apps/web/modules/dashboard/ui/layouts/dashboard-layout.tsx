import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";
import { DashboardSidebar } from "../components/dashboard-sidebar";
import { Provider } from "jotai";
// import { cookies } from "next/headers";
// import { DashboardSidebar } from "../components/dashboard-sidebar";
// import { Provider } from "jotai";

export const DashboardLayout = async ({
//   pro,
  children,
}: {
//   pro: boolean;
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <AuthGuard>
      <OrganizationGuard>
        <Provider>
         <SidebarProvider defaultOpen={defaultOpen}>
           <DashboardSidebar pro={true}/>
        {/* <Provider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <DashboardSidebar pro={pro} /> */}
            <main className="flex flex-1 flex-col">{children}</main>
          {/* </SidebarProvider>
        </Provider> */}
         </SidebarProvider>
        </Provider>
      </OrganizationGuard>
    </AuthGuard>
  );
};