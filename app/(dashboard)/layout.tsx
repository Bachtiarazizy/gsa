import Navbar from "@/app/(dashboard)/_components/navbar";
import { Sidebar } from "@/app/(dashboard)/_components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
}
