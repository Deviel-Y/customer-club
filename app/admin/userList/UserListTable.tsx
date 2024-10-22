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
import { User } from "@prisma/client";
import moment from "moment-jalaali";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

interface Props {
  users: User[];
  session: Session;
  totalPage: number;
}

const UserListTable = ({ users, totalPage, session }: Props) => {
  const router = useRouter();

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
      aria-label="List of users"
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn
            hidden={
              session.user.role === "ADMIN"
                ? column.value === "editInfo" || column.value === "role"
                : undefined
            }
            align="center"
            key={column.value}
          >
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>

      <TableBody emptyContent="کاربری تعریف نشده">
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell hidden={session.user.role === "ADMIN"}>
              <div className="flex flex-row justify-center items-center gap-x-3">
                <DeleteConfirmationButton
                  redirectEndpont="/admin/userList"
                  successMessage="کاربر با موفقیت حذف شد"
                  content="آیا از حذف این کاربر مطمئن اید؟"
                  title="حذف کاربر"
                  endpoint={`/api/userAuth/${user.id}`}
                  iconStyle="min-w-5 w-4"
                />
                <Button
                  onPress={() => router.push(`/admin/editUser/${user.id}`)}
                  color="warning"
                  isIconOnly
                >
                  <PencilSquareIcon className="min-w-5 w-4" />
                </Button>
              </div>
            </TableCell>
            <TableCell hidden={session?.user?.role === "ADMIN"}>
              {roleMapping[user.role]?.label}
            </TableCell>
            <TableCell>{user.companyName}</TableCell>
            <TableCell>{user.companyBranch}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.itManager}</TableCell>
            <TableCell>
              {moment(user.createdAt).format("jYYYY/jM/jD")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserListTable;

const roleMapping: Record<any, { label: any }> = {
  ADMIN: { label: "ادمین" },
  CUSTOMER: { label: "مشتری" },
};

const columns: {
  label: string;
  value: keyof User | "editInfo";
}[] = [
  { label: "حذف / ویرایش", value: "editInfo" },
  { label: "سطح دسترسی", value: "role" },
  { label: "نام سازمان", value: "companyName" },
  { label: "شعبه", value: "companyBranch" },
  { label: "آدرس ایمیل", value: "email" },
  { label: "مسئول انفوماتیک", value: "itManager" },
  { label: "تاریخ ایجاد", value: "createdAt" },
];
