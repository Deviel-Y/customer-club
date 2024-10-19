"use client";

import PaginationControl from "@/app/components/PaginationControl";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Notification, User } from "@prisma/client";
import axios from "axios";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";
import StatusBadge from "../admin/components/StatusBadge";

interface Props {
  notifications: any[];
  totalPage: number;
  user: User;
}

const NotificationListTable = ({ notifications, totalPage, user }: Props) => {
  const router = useRouter();
  const notificationIds = notifications.map((notification) => notification.id);

  return (
    <Table
      topContent={
        <div className="flex flex-row justify-between">
          <h2 className="text-lg">لیست اعلان ها</h2>
          {user?.role === "USER" && (
            <Button
              color="primary"
              size="sm"
              onPress={() =>
                axios
                  .patch(`/api/notification/setIsReadToTrue/${user.id}`)
                  .then(() => router.refresh())
              }
            >
              تغییر همه اعلان ها به خوانده شده
            </Button>
          )}
        </div>
      }
      bottomContent={
        <div
          className={`flex justify-center w-full ${
            totalPage === 1 && "hidden"
          }`}
        >
          <PaginationControl totalPage={totalPage} />
        </div>
      }
      isStriped
      aria-label="Ticket list table"
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn align="center" key={column.value}>
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>

      <TableBody emptyContent="تیکتی یافت نشد">
        {notifications.map((notification) => (
          <TableRow key={notification?.id}>
            <TableCell>{sectionMapping[notification?.type]?.label}</TableCell>
            <TableCell>
              {sectionMapping[notification?.assignedToSection]?.label}
            </TableCell>
            <TableCell>{notification?.user?.companyName}</TableCell>
            <TableCell>{notification?.user?.companyBranch}</TableCell>
            <TableCell>{notification?.message}</TableCell>
            <TableCell>
              <StatusBadge status={notification?.isRead} />
            </TableCell>
            <TableCell>
              {moment(notification?.createdAt).format("jYYYY/jM/jD")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default NotificationListTable;

const columns: {
  label: string;
  value: keyof Notification | "companyName" | "companyBranch";
}[] = [
  { label: "نوع اعلان", value: "type" },
  { label: "مربوط به بخش", value: "assignedToSection" },
  { label: "نام سازمان", value: "companyName" },
  { label: "شعبه", value: "companyBranch" },
  { label: "متن اعلان", value: "message" },
  { label: "وضعیت خوانده شده", value: "isRead" },
  { label: "تاریخ ایجاد", value: "createdAt" },
];

const sectionMapping: Record<any, { label: any }> = {
  INVOICE: { label: "فاکتور جدید" },
  POR_INVOICE: { label: "پیش فاکتور جدید" },
  TICKET: { label: "تیکت" },
  TICKET_MESSAGE: { label: "پاسخ به تیکت" },

  INFO: { label: "اطلاع رسانی" },
  WARNING: { label: "اخطار" },
  EXPIRED: { label: "منقضی شده" },
};
