"use client";

import { DeleteConfirmationButton } from "@/app/components/DeleteConfirmationButton";
import PaginationControl from "@/app/components/PaginationControl";
import formatNumber from "@/app/utils/formatNumber";
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
import { Invoice, Role } from "@prisma/client";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsDownload } from "react-icons/bs";
import ArchiveButton from "../components/ArchiveButton";
import { DeleteMutipleButton } from "../components/DeleteMultipleButton";

interface Props {
  invoices: Invoice[];
  totalPage: number;
  userRole: Role;
}

const AdminInvoiceTable = ({ invoices, totalPage, userRole }: Props) => {
  const router = useRouter();

  const [invoiceIds, setInvocieIds] = useState<string[]>();
  const allPorInvoiceIds = invoices.map((invoice) => invoice.id);

  const handleSelection = (key: "all" | Set<React.Key>) => {
    key === "all"
      ? setInvocieIds(allPorInvoiceIds?.map(String))
      : setInvocieIds(Array.from(key).map(String));
  };

  return (
    <Table
      selectionMode="multiple"
      selectedKeys={new Set(invoiceIds)}
      onSelectionChange={handleSelection}
      topContent={
        <div className="flex flex-row justify-between items-center w-full">
          <h2>جدول فاکتورها</h2>
          <div className="flex flex-row gap-3">
            <DeleteMutipleButton
              setListOfIds={(value) => setInvocieIds(value)}
              listOfIds={invoiceIds}
            />

            {userRole === "SUPER_ADMIN" && <ArchiveButton />}
          </div>
        </div>
      }
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
      <TableBody items={invoices} emptyContent="فاکتوری تعریف نشده است">
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              <div className="flex flex-row justify-center items-center gap-x-3">
                <DeleteConfirmationButton
                  redirectEndpont={`${
                    userRole === "ADMIN" ? "/admin/invoice-issuing" : "/invoice"
                  }`}
                  successMessage="فاکتور با موفقیت حذف شد."
                  content="آیا از حذف این فاکتور مطمئن اید؟"
                  title="حذف فاکتور"
                  endpoint={`/api/invoice/${invoice.id}`}
                  iconStyle="min-w-5 w-4"
                />

                <Button
                  onPress={() =>
                    router.push(
                      `/admin/invoice-issuing/editInvoiceInfo/${invoice.id}`
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
            <TableCell>{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.organization}</TableCell>
            <TableCell>{invoice.organizationBranch}</TableCell>
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

export default AdminInvoiceTable;

const columns: { label: string; value: keyof Invoice | "operation" }[] = [
  { label: "عملیات", value: "operation" },
  { label: "شماره فاکتور", value: "invoiceNumber" },
  { label: "سازمان", value: "organization" },
  { label: "شعبه", value: "organizationBranch" },
  { label: "توضیحات", value: "description" },
  { label: "مبلغ (ریال)", value: "price" },
  { label: "مالیات (ریال)", value: "tax" },
  { label: "مبلغ با مالیات (ریال)", value: "priceWithTax" },
  { label: "تاریخ صدور", value: "createdAt" },
];
