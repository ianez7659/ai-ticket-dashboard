"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, API_URL } from "@/lib/utils";
import AdminLayout from "@/components/layout/AdminLayout";

export default function TicketDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [ticket, setTicket] = useState<any>(null);
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [logs, setLogs] = useState<any[]>([]);
  const [displayedLogsCount, setDisplayedLogsCount] = useState(4);

  const runAI = async () => {
    const res = await fetch(`${API_URL}/tickets/${id}/summarize`, {
      method: "POST",
    });

    const data = await res.json();
    setSummary(data.summary);
    loadLogs();
  };

  const changeStatus = async (newStatus: string) => {
    setStatus(newStatus);

    await fetch(
      `${API_URL}/tickets/${id}/status?status=${newStatus}`,
      { method: "PUT" },
    );
    loadLogs();
  };

  const [reply, setReply] = useState("");
  const [isEditingReply, setIsEditingReply] = useState(false);
  
  const runReplyAI = async () => {
    const res = await fetch(`${API_URL}/tickets/${id}/reply`, {
      method: "POST",
    });

    const data = await res.json();
    setReply(data.reply);
    setIsEditingReply(false);
    loadLogs();
  };

  const handleSaveReply = () => {
    setIsEditingReply(false);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${API_URL}/tickets/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Ticket data:", data);
          console.log("Created at value:", data.created_at);
          console.log("Created at type:", typeof data.created_at);
          setTicket(data);
          setStatus(data.status);
        });

      loadLogs();
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (ticket) setStatus(ticket.status);
  }, [ticket]);

  const loadLogs = () => {
    fetch(`${API_URL}/tickets/${id}/logs`)
      .then((res) => res.json())
      .then((data) => setLogs(data));
  };

  if (!isAuthenticated || !ticket) {
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/tickets")}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tickets
          </Button>
          <h1 className="text-2xl font-bold">Ticket Detail</h1>
          <p className="text-gray-500 text-sm">AI-assisted support dashboard</p>
        </div>

        {/* Main Form Container */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Ticket Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4">{ticket.title}</h2>
              <p className="text-gray-600 mb-4">{ticket.description}</p>

              <div className="space-y-2">
                {(ticket.name || ticket.email) && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Contact:</span>
                    <span className="text-sm text-gray-700">
                      {ticket.name && <span>{ticket.name}</span>}
                      {ticket.name && ticket.email && <span> • </span>}
                      {ticket.email && <span>{ticket.email}</span>}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Status:</span>

                  <select
                    value={status}
                    onChange={(e) => changeStatus(e.target.value)}
                    className="border rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>

                {ticket.created_at && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Created:</span>
                    <span className="text-sm text-gray-700">
                      {formatDate(ticket.created_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>

          <div className="border-t"></div>

          {/* AI Summary */}
          <div>
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AI Summary</h3>
              {!summary && <Button onClick={runAI}>Generate</Button>}
            </div>
            <div>
            {summary ? (
              <div className="space-y-4">
                <div className="prose max-w-none break-words whitespace-pre-wrap">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
                {!reply && (
                  <Button onClick={runReplyAI}>Generate Reply</Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Generate AI summary for this ticket
              </p>
            )}
            </div>
          </div>

          <div className="border-t"></div>

          {/* AI Reply */}
          <div>
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AI Reply Draft</h3>
              {reply && !isEditingReply && (
                <Button onClick={() => setIsEditingReply(true)}>Edit</Button>
              )}
            </div>
            <div>
            {reply ? (
              isEditingReply ? (
                <div className="space-y-3">
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveReply}>Save</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingReply(false);
                        // Reset to original reply if needed
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none break-words whitespace-pre-wrap">
                  <ReactMarkdown>{reply}</ReactMarkdown>
                </div>
              )
            ) : (
              <p className="text-sm text-gray-400">
                Generate reply suggestion for customer
              </p>
            )}
            </div>
          </div>

          <div className="border-t"></div>

          {/* Activity Log */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
            <div>
            {logs.length === 0 ? (
              <p className="text-sm text-gray-400">No activity yet</p>
            ) : (
              <div className="border rounded-lg p-2 max-h-55 overflow-y-auto">
                {displayedLogsCount < logs.length ? (
                  <>
                    <div className="space-y-2">
                      {logs.slice(0, displayedLogsCount).map((log) => (
                        <div
                          key={log.id}
                          className="text-sm px-3 py-2"
                        >
                          {log.action}
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDisplayedLogsCount(prev => Math.min(prev + 5, logs.length))}
                      >
                        Load More
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="text-sm px-3 py-2"
                      >
                        {log.action}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
