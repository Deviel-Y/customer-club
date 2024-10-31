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
import { Notification, Role, User } from "@prisma/client";
import axios from "axios";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";

interface NotificationWithUsers extends Notification {
  users: User[];
}
interface Props {
  notifications: NotificationWithUsers[];
  totalPage: number;
  user: { id: string; role: Role };
  userRole: Role;
}

const NotificationListTable = ({
  notifications,
  totalPage,
  user,
  userRole,
}: Props) => {
  const router = useRouter();

  return (
    <Table
      topContent={
        <div className="flex flex-row justify-between">
          <h2 className="text-lg">اعلان های خوانده نشده</h2>
          {user?.role !== "SUPER_ADMIN" && (
            <Button
              isDisabled={notifications.length === 0}
              color="danger"
              variant="light"
              size="sm"
              onPress={() =>
                axios
                  .patch(`/api/notification/setIsReadToTrue/${user.id}`)
                  .then(() => router.refresh())
              }
            >
              حذف اعلان ها
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
      aria-label="notification list table"
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn
            hidden={
              userRole === "CUSTOMER" &&
              (column?.value === "companyName" ||
                column?.value === "companyBranch")
            }
            align="center"
            key={column.value}
          >
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>

      <TableBody emptyContent="اعلانی یافت نشد">
        {notifications.map((notification) => (
          <TableRow key={notification?.id}>
            <TableCell>{sectionMapping[notification?.type]?.label}</TableCell>
            <TableCell>
              {sectionMapping[notification?.assignedToSection]?.label}
            </TableCell>
            <TableCell hidden={userRole === "CUSTOMER"}>
              {notification.users[0]?.companyName}
            </TableCell>
            <TableCell hidden={userRole === "CUSTOMER"}>
              {notification?.users[0].companyBranch}
            </TableCell>
            <TableCell>{notification?.message}</TableCell>
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
  { label: "تاریخ ایجاد", value: "createdAt" },
];

const sectionMapping: Record<any, { label: any }> = {
  INVOICE: { label: "فاکتور جدید" },
  POR_INVOICE: { label: "پیش فاکتور جدید" },
  TICKET: { label: "تیکت" },
  TICKET_MESSAGE: { label: "پاسخ به تیکت" },

  INFO: { label: "اطلاع رسانی" },
  WARNING: { label: "هشدار" },
  EXPIRED: { label: "منقضی شده" },
};
