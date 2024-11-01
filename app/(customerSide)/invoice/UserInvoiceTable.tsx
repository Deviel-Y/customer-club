"use client";

import formatNumber from "@/app/utils/formatNumber";
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
import { BsDownload } from "react-icons/bs";
import PaginationControl from "../../components/PaginationControl";

interface Props {
  invoices: Invoice[];
  totalPage: number;
}

const UserInvoiceTable = ({ invoices, totalPage }: Props) => {
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
      aria-label="Invoices Table"
    >
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
              <Button isIconOnly color="primary" variant="shadow">
                <BsDownload size={20} />
              </Button>
            </TableCell>
            <TableCell>{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.description}</TableCell>
            <TableCell>{formatNumber(invoice.price)}</TableCell>
            <TableCell>{formatNumber(invoice.tax)}</TableCell>
            <TableCell>{formatNumber(invoice.priceWithTax)}</TableCell>
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
  { label: "مبلغ کل (ريال)", value: "price" },
  { label: "10% مالیات بر ارزش افزوده (ريال)", value: "tax" },
  { label: "جمع کل با احتساب مالیات (ريال)", value: "priceWithTax" },
  { label: "تاریخ صدور", value: "createdAt" },
];
