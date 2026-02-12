"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

export default function TicketDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [ticket, setTicket] = useState<any>(null);
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [logs, setLogs] = useState<any[]>([]);

  const runAI = async () => {
    const res = await fetch(`http://127.0.0.1:8000/tickets/${id}/summarize`, {
      method: "POST",
    });

    const data = await res.json();
    setSummary(data.summary);
    loadLogs();
  };

  const changeStatus = async (newStatus: string) => {
    setStatus(newStatus);

    await fetch(
      `http://127.0.0.1:8000/tickets/${id}/status?status=${newStatus}`,
      { method: "PUT" },
    );
    loadLogs();
  };

  const [reply, setReply] = useState("");
  const [isEditingReply, setIsEditingReply] = useState(false);
  
  const runReplyAI = async () => {
    const res = await fetch(`http://127.0.0.1:8000/tickets/${id}/reply`, {
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
      fetch(`http://127.0.0.1:8000/tickets/${id}`)
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
    fetch(`http://127.0.0.1:8000/tickets/${id}/logs`)
      .then((res) => res.json())
      .then((data) => setLogs(data));
  };

  if (!isAuthenticated || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
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

        {/* Ticket Info */}
        <Card>
          <CardHeader>
            <CardTitle>{ticket.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600">{ticket.description}</p>

            <div className="mt-4 space-y-2">
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
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>AI Summary</CardTitle>
            {!summary && <Button onClick={runAI}>Generate</Button>}
          </CardHeader>

          <CardContent>
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
          </CardContent>
        </Card>

        {/* AI Reply */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>AI Reply Draft</CardTitle>
            {reply && !isEditingReply && (
              <Button onClick={() => setIsEditingReply(true)}>Edit</Button>
            )}
          </CardHeader>

          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>

          <CardContent>
            {logs.length === 0 ? (
              <p className="text-sm text-gray-400">No activity yet</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="text-sm border rounded-lg px-3 py-2 bg-gray-50"
                  >
                    {log.action}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
