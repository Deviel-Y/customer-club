"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Invoice } from "@prisma/client";
import moment from "moment-jalaali";
import PaginationControl from "../components/PaginationControl";

interface Props {
  invoices: Invoice[];
  totalPage: number;
}

const UserInvoiceTable = ({ invoices, totalPage }: Props) => {
  return (
    <Table
      bottomContent={
        <div className="flex justify-center w-full">
          <PaginationControl totalPage={totalPage} />
        </div>
      }
      isStriped
      aria-label="Invoices Table"
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn
            width={column.value === "description" ? 800 : undefined}
            align="center"
            key={column.value}
          >
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={invoices} emptyContent="فاکتوری برای شما وجود ندارد">
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              <Button color="primary" variant="shadow">
                دانلود
              </Button>
            </TableCell>
            <TableCell>{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.description}</TableCell>
            <TableCell>
              {moment(invoice.createdAt).format("jYYYY/jM/jD")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserInvoiceTable;

const columns: { label: string; value: keyof Invoice | "downloadInvoice" }[] = [
  { label: "دریافت فاکتور", value: "downloadInvoice" },
  { label: "شماره فاکتور", value: "invoiceNumber" },
  { label: "توضیحات", value: "description" },
  { label: "تاریخ صدور", value: "createdAt" },
];
