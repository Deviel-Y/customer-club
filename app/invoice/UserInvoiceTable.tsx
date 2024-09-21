"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Invoice } from "@prisma/client";

interface Props {
  invoices: Invoice[];
}

const UserInvoiceTable = ({ invoices }: Props) => {
  const columns: { label: string; value: keyof Invoice }[] = [
    { label: "شماره فاکتور", value: "invoiceNumber" },
    { label: "توضیحات", value: "description" },
    { label: "تاریخ صدور", value: "createdAt" },
  ];

  return (
    <Table isStriped aria-label="Invoices Table">
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
            <TableCell>{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.description}</TableCell>
            <TableCell>{invoice.createdAt.toDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserInvoiceTable;
