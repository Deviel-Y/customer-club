import prisma from "@/prisma/client";
import UserForm from "../../../components/UserForm";

interface Props {
  params: { id: string };
}

const EditUserPage = async ({ params: { id } }: Props) => {
  const user = await prisma.user.findUnique({ where: { id: id } });

  return (
    <div>
      <UserForm user={user!} />
    </div>
  );
};

export default EditUserPage;
