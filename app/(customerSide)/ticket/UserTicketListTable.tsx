"use client";

import StatusBadge from "@/app/admin/components/StatusBadge";
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
import { Ticket } from "@prisma/client";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";
import { BsEye } from "react-icons/bs";
import NewTicketPopoverButton from "./NewTicketPopoverButton";

interface Props {
  tickets: Ticket[];
  totalPage: number;
}

const UserTicketListTable = ({ tickets, totalPage }: Props) => {
  const router = useRouter();

  return (
    <Table
      topContent={
        <div className="flex gap-x-5 max-md:justify-start justify-between items-center">
          <h2>لیست تیکت ها</h2>

          <NewTicketPopoverButton />
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
          <TableColumn
            width={column.value === "title" ? "500" : undefined}
            align="center"
            key={column.value}
          >
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>

      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket?.id}>
            <TableCell>
              <Button
                isIconOnly
                onPress={() =>
                  router.push(`/ticket/ticketDetail/${ticket?.id}`)
                }
                color="primary"
              >
                <BsEye size={20} />
              </Button>
            </TableCell>
            <TableCell className="text-nowrap">{ticket.ticketNumber}</TableCell>
            <TableCell className="text-nowrap">
              {categoryMapping[ticket.category]?.label}
            </TableCell>
            <TableCell>{ticket?.title}</TableCell>
            <TableCell>
              <StatusBadge status={ticket?.status} />
            </TableCell>
            <TableCell>
              {moment(ticket?.createdAt).format("jYYYY/jM/jD")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTicketListTable;

const columns: {
  label: string;
  value: keyof Ticket | "detail";
}[] = [
  { label: "مشاهده جزئیات", value: "detail" },
  { label: "شماره تیکت", value: "ticketNumber" },
  { label: "دسته بندی", value: "category" },
  { label: "عنوان تیکت", value: "title" },
  { label: "وضعیت تیکت", value: "status" },
  { label: "تاریخ ایجاد", value: "createdAt" },
];

const categoryMapping: Record<any, { label: any }> = {
  FEATURE_REQUEST: {
    label: "درخواست ویژگی جدید",
  },
  GENERAL_INQUIRY: { label: "سوالات عمومی" },
  PAYMENT: {
    label: "صورتحساب و پردخت ها",
  },
  TECHNICAL_SUPPORT: {
    label: "پشتیبانی فنی",
  },
};
