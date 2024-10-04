import { Status } from "@prisma/client";

interface Props {
  status: Status;
}

const StatusBadge = ({ status }: Props) => {
  return (
    <span
      className={`px-2 py-1 rounded-full ${statusMapping[status].className}`}
    >
      {statusMapping[status].label}
    </span>
  );
};

export default StatusBadge;

const statusMapping: Record<Status, { label: string; className: string }> = {
  EXPIRED: { className: "bg-red-200", label: "منقضی شده" },
  IN_PROGRESS: { className: "bg-green-200", label: "دارای اعتبار" },
};
