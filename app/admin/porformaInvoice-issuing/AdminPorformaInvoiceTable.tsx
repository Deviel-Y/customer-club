"use client";

import { DeleteConfirmationButton } from "@/app/admin/components/DeleteConfirmationButton";
import PaginationControl from "@/app/components/PaginationControl";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
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
import { useRouter } from "next/navigation";
import { BsDownload } from "react-icons/bs";

interface Props {
  porformaInvoice: PorformaInvoice[];
  totalPage: number;
}

const AdminPorformaInvoiceTable = ({ porformaInvoice, totalPage }: Props) => {
  const router = useRouter();

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
            width={column.value === "description" ? 500 : undefined}
            align="center"
            key={column.value}
          >
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        items={porformaInvoice}
        emptyContent="پیش فاکتوری تعریف نشده است"
      >
        {porformaInvoice.map((p_invoice) => (
          <TableRow key={p_invoice.id}>
            <TableCell>
              <div className="flex flex-row justify-center items-center gap-x-3">
                <DeleteConfirmationButton
                  successMessage="فاکتور با موفقیت حذف شد."
                  content="آیا از حذف این کاربر مطمئن اید؟"
                  title="حذف فاکتور"
                  endpoint={`/api/invoice/${p_invoice.id}`}
                />

                <Button
                  onPress={() =>
                    router.push(
                      `/admin/invoice-issuing/editInvoiceInfo/${p_invoice.id}`
                    )
                  }
                  isIconOnly
                  color="warning"
                  variant="shadow"
                >
                  <PencilSquareIcon className="min-w-5 w-4" />
                </Button>

                <Button isIconOnly color="primary" variant="shadow">
                  <BsDownload size={20} />
                </Button>
              </div>
            </TableCell>
            <TableCell>{p_invoice.porformaInvoiceNumber}</TableCell>
            <TableCell>{p_invoice.organization}</TableCell>
            <TableCell>{p_invoice.organizationBranch}</TableCell>
            <TableCell>{p_invoice.description}</TableCell>
            <TableCell>
              {moment(p_invoice.createdAt).format("jYYYY/jM/jD")}
            </TableCell>
            <TableCell>
              {moment(p_invoice.expiredAt).format("jYYYY/jM/jD")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminPorformaInvoiceTable;

const columns: { label: string; value: keyof PorformaInvoice | "operation" }[] =
  [
    { label: "عملیات", value: "operation" },
    { label: "شماره پیش فاکتور", value: "porformaInvoiceNumber" },
    { label: "سازمان", value: "organization" },
    { label: "شعبه", value: "organizationBranch" },
    { label: "توضیحات", value: "description" },
    { label: "تاریخ صدور", value: "createdAt" },
    { label: "تاریخ انقضا", value: "expiredAt" },
  ];
