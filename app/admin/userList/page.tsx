import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { Role } from "@prisma/client";
import UserListTable from "./UserListTable";
import UserSearchField from "./UserSearchField";

interface Props {
  searchParams: {
    companyName: string;
    companyBranch: string;
    email: string;
    itManager: string;
    role: Role;
    pageNumber: number;
  };
}

const UserListPage = async ({
  searchParams: {
    companyBranch,
    companyName,
    email,
    itManager,
    pageNumber,
    role,
  },
}: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const prismaRole = Object.values(Role);
  const selectedRole = prismaRole.includes(role) ? role : undefined;

  const currentPage = pageNumber || 1;

  const [adminSideUsers, userCount] = await prisma.$transaction([
    prisma.user.findMany({
      where: {
        role: session?.user.role === "ADMIN" ? "CUSTOMER" : selectedRole,
        companyName: { contains: companyName },
        companyBranch: { contains: companyBranch },
        email: { contains: email },
        itManager: { contains: itManager },
      },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
      orderBy: { createdAt: "desc" },
    }),

    prisma.user.count({
      where: {
        role: "CUSTOMER",
        companyName: { contains: companyName },
        companyBranch: { contains: companyBranch },
        email: { contains: email },
        itManager: { contains: itManager },
      },
    }),
  ]);

  return (
    <div className="px-5 py-2 gap-5 flex flex-col">
      <UserSearchField userRole={session?.user.role!} />

      <UserListTable
        session={session!}
        users={
          session?.user?.role === "ADMIN"
            ? adminSideUsers
            : adminSideUsers.filter((user) => user.role !== "SUPER_ADMIN")
        }
        totalPage={Math.ceil(userCount / pageSize)}
      />
    </div>
  );
};

export default UserListPage;

const pageSize: number = 6;
