import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import UserForm from "../../createNewUser/UserForm";

interface Props {
  params: { id: string };
}

const EditUserPage = async ({ params: { id } }: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const user = await prisma.user.findUnique({ where: { id } });

  return (
    <div>
      <UserForm user={user!} />
    </div>
  );
};

export default EditUserPage;
