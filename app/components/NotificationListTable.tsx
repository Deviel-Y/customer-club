"use client";

import PaginationControl from "@/app/components/PaginationControl";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Notification } from "@prisma/client";
import moment from "moment-jalaali";
import StatusBadge from "../admin/components/StatusBadge";

interface Props {
  notifications: any[];
  totalPage: number;
}

const NotificationListTable = ({ notifications, totalPage }: Props) => {
  return (
    <Table
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
};
