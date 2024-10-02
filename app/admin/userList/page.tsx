import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import UserListTable from "./UserListTable";
import UserSearchField from "./UserSearchField";

interface Props {
  searchParams: {
    companyName: string;
    companyBranch: string;
    email: string;
    itManager: string;
    pageNumber: number;
  };
}

const UserListPage = async ({
  searchParams: { companyBranch, companyName, email, itManager, pageNumber },
}: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const currentPage = pageNumber || 1;

  const users: User[] = await prisma.user.findMany({
    where: {
      role: "USER",
      companyName: { contains: companyName },
      companyBranch: { contains: companyBranch },
      email: { contains: email },
      itManager: { contains: itManager },
    },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { createdAt: "desc" },
  });

  const userCount: number = await prisma.user.count({
    where: {
      role: "USER",
      companyName: { contains: companyName },
      companyBranch: { contains: companyBranch },
      email: { contains: email },
      itManager: { contains: itManager },
    },
  });

  return (
    <div className="px-5 py-2 flex flex-col">
      <UserSearchField />

      <UserListTable
        users={users}
        totalPage={Math.ceil(userCount / pageSize)}
      />
    </div>
  );
};

export default UserListPage;

const pageSize: number = 6;
