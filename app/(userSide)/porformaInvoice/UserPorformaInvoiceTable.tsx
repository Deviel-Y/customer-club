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
import { PorformaInvoice } from "@prisma/client";
import moment from "moment-jalaali";
import PaginationControl from "../../components/PaginationControl";

interface Props {
  invoices: PorformaInvoice[];
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
      aria-label="Porform Invoices Table"
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
      <TableBody
        items={invoices}
        emptyContent="پیش فاکتوری برای شما وجود ندارد"
      >
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              <Button color="primary" variant="shadow">
                دانلود
              </Button>
            </TableCell>
            <TableCell>{invoice.porformaInvoiceNumber}</TableCell>
            <TableCell>{invoice.description}</TableCell>
            <TableCell>
              {moment(invoice.createdAt).format("jYYYY/jM/jD")}
            </TableCell>
            <TableCell>
              {moment(invoice.expiredAt).format("jYYYY/jM/jD")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserInvoiceTable;

const columns: {
  label: string;
  value: keyof PorformaInvoice | "downloadInvoice";
}[] = [
  { label: "دریافت پیش فاکتور", value: "downloadInvoice" },
  { label: "شماره پیش فاکتور", value: "porformaInvoiceNumber" },
  { label: "توضیحات", value: "description" },
  { label: "تاریخ صدور", value: "createdAt" },
  { label: "تاریخ انقضا", value: "expiredAt" },
];
