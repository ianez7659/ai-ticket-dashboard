"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";

export default function AdminLayout({ children }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin");
    router.push("/");
  };

  // Get current page title based on pathname - header title
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/tickets") return "Tickets";
    if (pathname === "/tickets/archived") return "Archived";
    if (pathname?.startsWith("/tickets/") && pathname !== "/tickets") {
      return "Ticket Detail";
    }
    return "Dashboard";
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-start gap-2 p-6 bg-gray-200">
        <LayoutDashboard className="h-8 w-8 text-gray-700" />
        <span className="font-bold text-2xl text-gray-700">I.Ai.S</span>
      </div>
      <nav className="space-y-2 px-4 py-8 ">
        <Link
          href="/dashboard"
          className="block p-2 rounded hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          href="/tickets"
          className="block p-2 rounded hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Tickets
        </Link>
        <Link
          href="/tickets/archived"
          className="block p-2 rounded hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Archived
        </Link>
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 bg-gray-100">
          <div className="flex items-center justify-start gap-2">
            <LayoutDashboard className="h-8 w-8 text-gray-700" />
            <span className="font-bold text-xl text-gray-700">I.Ai.S</span>
          </div>
        </div>
        <nav className="space-y-2 px-4 pt-4">
          <Link
            href="/dashboard"
            className="block p-2 rounded hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/tickets"
            className="block p-2 rounded hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Tickets
          </Link>
          <Link
            href="/tickets/archived"
            className="block p-2 rounded hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Archived
          </Link>
        </nav>
      </aside>

      {/* main */}
      <div className="flex-1 flex flex-col">
        {/* top bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 relative z-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded transition-transform"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">Ianez Ai-Support</h1>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 font-medium">{getPageTitle()}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-sm bg-black text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </header>

        {/* page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
