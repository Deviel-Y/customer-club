"use client";

import StatusBadge from "@/app/admin/components/StatusBadge";
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
  porInvoices: PorformaInvoice[];
  totalPage: number;
}

const UserInvoiceTable = ({ porInvoices, totalPage }: Props) => {
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
        items={porInvoices}
        emptyContent="پیش فاکتوری برای شما وجود ندارد"
      >
        {porInvoices.map((porInvoice) => (
          <TableRow key={porInvoice.id}>
            <TableCell>
              <Button color="primary" variant="shadow">
                دانلود
              </Button>
            </TableCell>
            <TableCell>{porInvoice.porformaInvoiceNumber}</TableCell>
            <TableCell>{porInvoice.description}</TableCell>
            <TableCell>
              <StatusBadge status={porInvoice.status} />
            </TableCell>
            <TableCell>
              {moment(porInvoice.createdAt).format("jYYYY/jM/jD")}
            </TableCell>
            <TableCell>
              {moment(porInvoice.expiredAt).format("jYYYY/jM/jD")}
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
  { label: "وضعیت اعتبار", value: "status" },
  { label: "تاریخ صدور", value: "createdAt" },
  { label: "تاریخ انقضا", value: "expiredAt" },
];
