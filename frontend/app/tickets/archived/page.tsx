"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import TicketCard from "@/components/TicketCard";
import { API_URL } from "@/lib/utils";

export default function ArchivedTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const loadTickets = () => {
    fetch(`${API_URL}/tickets`)
      .then((res) => res.json())
      .then((data) => {
        // Filter only DONE tickets and sort by created_at date (newest first)
        const doneTickets = data.filter((t: any) => t.status === "DONE");
        const sortedData = [...doneTickets].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA; // Descending order (newest first)
        });
        setTickets(sortedData);
        setFilteredTickets(sortedData);
      });
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = tickets.filter((ticket) => {
      const title = ticket.title?.toLowerCase() || "";
      const description = ticket.description?.toLowerCase() || "";
      const name = ticket.name?.toLowerCase() || "";
      const email = ticket.email?.toLowerCase() || "";

      return (
        title.includes(query) ||
        description.includes(query) ||
        name.includes(query) ||
        email.includes(query)
      );
    });

    setFilteredTickets(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, tickets]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedTickets = filteredTickets.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!isLoading) {
      loadTickets();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-1 md:px-6 py-2">
        <h1 className="text-2xl font-bold mb-4">Archived Tickets</h1>
        <p className="text-sm text-gray-500 mb-6">
          Completed tickets (DONE status)
        </p>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search archived tickets by title, description, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Ticket List */}
        {filteredTickets.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            {searchQuery ? "No archived tickets found matching your search." : "No archived tickets yet"}
          </p>
        ) : (
          <>
            {displayedTickets.map((t) => (
              <TicketCard key={t.id} ticket={t} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

