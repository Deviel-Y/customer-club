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
import { Log, LogSection } from "@prisma/client";
import moment from "moment-jalaali";

interface Props {
  logs: Log[];
  totalPage: number;
}

const LogTable = ({ logs, totalPage }: Props) => {
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
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn align="center" key={column.value}>
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>

      <TableBody emptyContent="گزارشی یافت نشد">
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{log.issuer}</TableCell>
            <TableCell>
              {sesctionMapping[log.assignedToSection]?.label}
            </TableCell>
            <TableCell>{log.message}</TableCell>
            <TableCell>{moment(log.createdAt).format("HH:mm")}</TableCell>
            <TableCell>{moment(log.createdAt).format("jYYYY/jM/jD")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LogTable;

const sesctionMapping: Record<LogSection, { label: string }> = {
  INVOICE: { label: "فاکتور" },
  POR_INVOICE: { label: "پیش فاکتور" },
  TICKET: { label: "تیکت" },
  TICKET_MESSAGE: { label: "پاسخ به تیکت" },
  LOGIN: { label: "ورود" },
};

const columns: { label: string; value: keyof Log | "dateTime" }[] = [
  { label: "صادر کننده", value: "issuer" },
  { label: "مربوط به بخش", value: "assignedToSection" },
  { label: "پیام", value: "message" },
  { label: "ساعت", value: "dateTime" },
  { label: "تاریخ", value: "createdAt" },
];
