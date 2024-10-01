"use client";

import { DeleteConfirmationButton } from "@/app/components/DeleteConfirmationButton";
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
import { Invoice } from "@prisma/client";
import moment from "moment-jalaali";
import { BsDownload } from "react-icons/bs";

interface Props {
  invoices: Invoice[];
  totalPage: number;
}

const AdminInvoiceTable = ({ invoices, totalPage }: Props) => {
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
          <TableColumn align="center" key={column.value}>
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={invoices} emptyContent="فاکتوری برای شما وجود ندارد">
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              <div className="flex flex-row justify-center items-center gap-x-3">
                <Button isIconOnly color="primary" variant="shadow">
                  <BsDownload size={20} />
                </Button>
                <DeleteConfirmationButton
                  content="آیا از حذف این کاربر مطمئن اید؟"
                  title="حذف فاکتور"
                  endpoint={`/api/invoice/${invoice.id}`}
                />
              </div>
            </TableCell>
            <TableCell>{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.organization}</TableCell>
            <TableCell>{invoice.organizationBranch}</TableCell>
            <TableCell>{invoice.description}</TableCell>
            <TableCell>
              {moment(invoice.createdAt).format("jYYYY/jM/jD")}
            </TableCell>
            <TableCell>
              {moment(invoice.updatedAt).format("jYYYY/jM/jD")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminInvoiceTable;

const columns: { label: string; value: keyof Invoice | "downloadInvoice" }[] = [
  { label: "دریافت فاکتور", value: "downloadInvoice" },
  { label: "شماره فاکتور", value: "invoiceNumber" },
  { label: "سازمان", value: "organization" },
  { label: "شعبه", value: "organizationBranch" },
  { label: "توضیحات", value: "description" },
  { label: "تاریخ صدور", value: "createdAt" },
  { label: "تاریخ بروزسانی", value: "updatedAt" },
];
