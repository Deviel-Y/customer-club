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

interface Props {
  invoices: Invoice[];
}

const AdminInvoiceTable = ({ invoices }: Props) => {
  const columns: { label: string; value: keyof Invoice }[] = [
    { label: "دریافت فاکتور", value: "organization" }, //this is temprerary
    { label: "شماره فاکتور", value: "invoiceNumber" },
    { label: "سازمان", value: "organization" },
    { label: "شعبه", value: "organizationBranch" },
    { label: "توضیحات", value: "description" },
    { label: "تاریخ صدور", value: "createdAt" },
    { label: "تاریخ بروزسانی", value: "updatedAt" },
  ];

  return (
    <Table isStriped aria-label="Invoices Table">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn align="center" key={column.value}>
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
            <TableCell>{invoice.organization}</TableCell>
            <TableCell>{invoice.organizationBranch}</TableCell>
            <TableCell>{invoice.description}</TableCell>
            <TableCell>{invoice.createdAt.toDateString()}</TableCell>
            <TableCell>{invoice.updatedAt.toDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminInvoiceTable;
