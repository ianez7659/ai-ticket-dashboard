interface StatusBadgeProps {
  status: string;
  className?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
      return "bg-green-100 text-green-800";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800";
    case "DONE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded whitespace-nowrap min-w-[80px] h-[24px] flex items-center justify-center flex-shrink-0 ${getStatusColor(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}

