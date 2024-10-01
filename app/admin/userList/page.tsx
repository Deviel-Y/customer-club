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
    pageNumber: string;
  };
}

const UserListPage = async ({
  searchParams: { companyBranch, companyName, email, itManager, pageNumber },
}: Props) => {
  const users: User[] = await prisma.user.findMany({
    where: {
      role: "USER",
      companyName: { contains: companyName },
      companyBranch: { contains: companyBranch },
      email: { contains: email },
      itManager: { contains: itManager },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-5 py-2 flex flex-col">
      <UserSearchField />

      <UserListTable users={users} />
    </div>
  );
};

export default UserListPage;
