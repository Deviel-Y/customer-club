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
import { User } from "@prisma/client";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";

interface Props {
  users: User[];
  totalPage: number;
}

const UserListTable = ({ users, totalPage }: Props) => {
  const router = useRouter();

  return (
    <Table
      bottomContent={
        <div className="flex justify-center w-full">
          <PaginationControl totalPage={totalPage} />
        </div>
      }
      isStriped
      aria-label="List of users"
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn
            width={column.value === "companyName" ? 400 : undefined}
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
            <TableCell>
              <div className="flex flex-row justify-center items-center gap-x-3">
                <DeleteConfirmationButton
                  content="آیا از حذف این کاربر مطمئن اید؟"
                  title="حذف کاربر"
                  endpoint={`/api/userAuth/${user.id}`}
                />
                <Button
                  onPress={() => router.push(`/admin/editUser/${user.id}`)}
                  color="success"
                  isIconOnly
                >
                  <PencilSquareIcon className="min-w-5 w-4" />
                </Button>
              </div>
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

const columns: {
  label: string | JSX.Element;
  value: keyof User | "editInfo";
}[] = [
  { label: "ویرایش اطلاعات", value: "editInfo" },
  { label: "نام سازمان", value: "companyName" },
  { label: "شعبه", value: "companyBranch" },
  { label: "آدرس ایمیل", value: "email" },
  { label: "مسئول انفوماتیک", value: "itManager" },
  { label: "تاریخ ایجاد", value: "createdAt" },
];
