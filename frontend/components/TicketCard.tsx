import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import { formatDate } from "@/lib/utils";

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    description?: string;
    status: string;
    name?: string;
    email?: string;
    created_at?: string;
  };
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/tickets/${ticket.id}`)}
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition my-3 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="font-semibold text-lg flex-1 break-words">{ticket.title}</h3>
        <StatusBadge status={ticket.status} />
      </div>
      <p className="text-gray-600 mb-2">
        {ticket.description ? ticket.description.slice(0, 80) : ""}
        {ticket.description && ticket.description.length > 80 && "..."}
      </p>
      {(ticket.name || ticket.email) && (
        <div className="text-xs text-gray-500 mb-1">
          {ticket.name && <span>{ticket.name}</span>}
          {ticket.name && ticket.email && <span> • </span>}
          {ticket.email && <span>{ticket.email}</span>}
        </div>
      )}
      {ticket.created_at && (
        <p className="text-xs text-gray-500">
          Created: {formatDate(ticket.created_at)}
        </p>
      )}
    </div>
  );
}

