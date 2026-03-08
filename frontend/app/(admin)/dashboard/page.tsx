"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import TicketCard from "@/components/TicketCard";
import StatCard from "@/components/StatCard";
import { API_URL } from "@/lib/utils";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/dashboard/stats`)
      .then((res) => res.json())
      .then(setStats);

    fetch(`${API_URL}/tickets/recent`)
      .then((res) => res.json())
      .then(setTickets)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Support ticket management overview
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard className="" title="TOTAL" value={stats?.total ?? 0} />
        <StatCard className="bg-green-200 text-green-800" title="OPEN" value={stats?.open ?? 0} />
        <StatCard className="bg-yellow-200 text-yellow-800" title="IN PROGRESS" value={stats?.in_progress ?? 0} />
        <StatCard className="bg-red-200 text-red-800" title="DONE" value={stats?.done ?? 0} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Tickets</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {tickets.length === 0 ? (
            <p className="text-sm text-gray-400">No tickets yet</p>
          ) : (
            tickets.map((t) => (
              <TicketCard key={t.id} ticket={t} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
