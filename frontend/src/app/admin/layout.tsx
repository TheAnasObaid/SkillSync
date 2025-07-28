import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import Link from "next/link";
import { FiClipboard, FiGrid, FiUsers } from "react-icons/fi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-grow">
        <aside className="w-64 bg-base-200 p-4">
          <ul className="menu menu-vertical text-base font-semibold">
            <li>
              <Link href="/admin/panel">
                <FiGrid /> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/submissions">
                <FiClipboard /> Submissions
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <FiUsers /> Users
              </Link>
            </li>
          </ul>
        </aside>
        <main className="flex-grow bg-base-100">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
