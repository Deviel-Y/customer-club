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
import StatusBadge from "../components/StatusBadge";

interface Props {
  tickets: any[];
  totalPage: number;
}

const TicketListTable = ({ tickets, totalPage }: Props) => {
  return (
    <Table
      bottomContent={
        <div className="flex justify-center w-full">
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
          <TableRow key={ticket.id}>
            <TableCell>
              <Button color="primary">نمایش تیکت</Button>
            </TableCell>
            <TableCell>{ticket.subject}</TableCell>
            <TableCell>{ticket.title}</TableCell>
            <TableCell>
              <StatusBadge status={ticket.status} />
            </TableCell>
            <TableCell>{ticket.User.companyName}</TableCell>
            <TableCell>{ticket.User.companyBranch}</TableCell>
            <TableCell>
              {moment(ticket.createdAt).format("jYYYY/jM/jD")}
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
  { label: "موضوع", value: "subject" },
  { label: "عنوان تیکت", value: "title" },
  { label: "وضعیت تیکت", value: "status" },
  { label: "نام سازمان", value: "companyName" },
  { label: "شعبه", value: "companyBranch" },
  { label: "تاریخ ایجاد", value: "createdAt" },
];
