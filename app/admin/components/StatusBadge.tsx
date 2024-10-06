import { Chip } from "@nextui-org/react";
import { Status, TicketStatus } from "@prisma/client";

interface Props {
  status: Status;
}

const StatusBadge = ({ status }: Props) => {
  return (
    <Chip color={statusMapping[status].color}>
      {statusMapping[status].label}
    </Chip>
  );
};

export default StatusBadge;

const statusMapping: Record<
  Status | TicketStatus,
  { label: string; color: "danger" | "success" | "warning" | "primary" }
> = {
  EXPIRED: { color: "danger", label: "منقضی شده" },
  IN_PROGRESS: { color: "success", label: "دارای اعتبار" },
  CLOSED: { color: "success", label: "پایان یافته" },
  OPEN: { color: "danger", label: "جدید" },
  INVESTIGATING: { color: "primary", label: "در حال بررسی" },
};
