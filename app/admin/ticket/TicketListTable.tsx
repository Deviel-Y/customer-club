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
import { Ticket } from "@prisma/client";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";
import StatusBadge from "../components/StatusBadge";

interface Props {
  tickets: any[];
  totalPage: number;
}

const TicketListTable = ({ tickets, totalPage }: Props) => {
  const router = useRouter();

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
          <TableColumn
            width={column.value === "title" ? "500" : undefined}
            align="center"
            key={column.value}
          >
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>

      <TableBody emptyContent="تیکتی یافت نشد">
        {tickets.map((ticket) => (
          <TableRow key={ticket?.id}>
            <TableCell>
              <Button
                onPress={() =>
                  router.push(`/admin/ticket/ticketDetail/${ticket?.id}`)
                }
                color="primary"
              >
                نمایش تیکت
              </Button>
            </TableCell>
            <TableCell>{ticket.ticketNumber}</TableCell>
            <TableCell>{categoryMapping[ticket?.category].label}</TableCell>
            <TableCell>{ticket?.title}</TableCell>
            <TableCell>{ticket?.User?.companyName}</TableCell>
            <TableCell>{ticket?.User?.companyBranch}</TableCell>
            <TableCell>
              <StatusBadge status={ticket?.status} />
            </TableCell>
            <TableCell>
              {moment(ticket?.createdAt).format(" HH:mm jYYYY/jMM/jDD")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketListTable;

const columns: {
  label: string;
  value: keyof Ticket | "detail" | "companyName" | "companyBranch";
}[] = [
  { label: "مشاهده جزئیات", value: "detail" },
  { label: "شماره تیکت", value: "ticketNumber" },
  { label: "دسته بندی", value: "category" },
  { label: "عنوان تیکت", value: "title" },
  { label: "نام سازمان", value: "companyName" },
  { label: "شعبه", value: "companyBranch" },
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
