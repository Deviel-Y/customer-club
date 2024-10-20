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
import { ArchivedPorformaInvoice, PorformaInvoice } from "@prisma/client";
import moment from "moment-jalaali";
import React, { useState } from "react";
import { BsDownload } from "react-icons/bs";
import { DeleteMutiplePorInvoiceButton } from "../porformaInvoice-issuing/DeleteMutiplePorInvoiceButton";
import BackToPorInvoiceButton from "./BackToPorInvoiceButton";

interface Props {
  archivedInvoice: ArchivedPorformaInvoice[];
  totalPage: number;
}

const ArchivedPorformaInvoiceTable = ({
  archivedInvoice,
  totalPage,
}: Props) => {
  const [porInvoiceIds, setPorInvoiceIds] = useState<string[]>([]);
  const allPorInvoiceIds = archivedInvoice.map(
    (archivedPorInvoice) => archivedPorInvoice.id
  );
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
            <DeleteMutiplePorInvoiceButton
              setListOfIds={(value) => setPorInvoiceIds(value)}
              listOfIds={porInvoiceIds}
            />

            <BackToPorInvoiceButton />
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
        items={archivedInvoice}
        emptyContent="پیش فاکتوری تعریف نشده است"
      >
        {archivedInvoice.map((p_invoice) => (
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

export default ArchivedPorformaInvoiceTable;

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
