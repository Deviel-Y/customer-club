"use client";

import { DeleteConfirmationButton } from "@/app/components/DeleteConfirmationButton";
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
import { PorformaInvoice, Role } from "@prisma/client";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsDownload } from "react-icons/bs";
import ArchiveButton from "../components/ArchiveButton";
import { DeleteMutipleButton } from "../components/DeleteMultipleButton";
import StatusBadge from "../components/StatusBadge";

interface Props {
  porformaInvoice: PorformaInvoice[];
  totalPage: number;
  userRole: Role;
}

const AdminPorformaInvoiceTable = ({
  porformaInvoice,
  totalPage,
  userRole,
}: Props) => {
  const router = useRouter();

  const [porInvoiceIds, setPorInvoiceIds] = useState<string[]>([]);
  const allPorInvoiceIds = porformaInvoice.map((por_invoice) => por_invoice.id);
  const handleSelectionChange = (key: "all" | Set<React.Key>) =>
    key === "all"
      ? setPorInvoiceIds(allPorInvoiceIds.map(String))
      : setPorInvoiceIds(Array.from(key).map(String));

  return (
    <Table
      topContent={
        <div className="flex flex-row justify-between items-center w-full">
          <h2>جدول پیش فاکتورها</h2>
          <div className="flex flex-row gap-3">
            <DeleteMutipleButton
              setListOfIds={(value) => setPorInvoiceIds(value)}
              listOfIds={porInvoiceIds}
            />
            {userRole === "SUPER_ADMIN" && <ArchiveButton />}
          </div>
        </div>
      }
      selectedKeys={new Set(porInvoiceIds)}
      selectionMode="multiple"
      onSelectionChange={handleSelectionChange}
      color="primary"
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
      aria-label="Porforma Invoices Table"
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
                  redirectEndpont="/admin/porformaInvoice-issuing"
                  successMessage="پیش فاکتور با موفقیت حذف شد."
                  content="آیا از حذف این پیش فاکتور مطمئن اید؟"
                  title="حذف پیش فاکتور"
                  endpoint={`/api/porformaInvoice/${p_invoice.id}`}
                  iconStyle="min-w-5 w-4"
                />

                <Button
                  onPress={() =>
                    router.push(
                      `/admin/porformaInvoice-issuing/editPorInvoiceInfo/${p_invoice.id}`
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
              <StatusBadge status={p_invoice.status} />
            </TableCell>
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
    { label: "وضعیت انقضا", value: "status" },
    { label: "تاریخ صدور", value: "createdAt" },
    { label: "تاریخ انقضا", value: "expiredAt" },
  ];
