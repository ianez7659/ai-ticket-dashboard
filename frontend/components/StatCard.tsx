import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  className?: string;
  valueClassName?: string;
}

export default function StatCard({ title, value, className, valueClassName }: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn("text-3xl font-bold", valueClassName)}>{value ?? 0}</p>
      </CardContent>
    </Card>
  );
}

