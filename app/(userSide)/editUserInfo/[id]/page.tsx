import getSession from "@/app/libs/getSession";
import { authorizeUser } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { notFound, redirect } from "next/navigation";
import EditUserInfoForm from "./EditUserInfoForm";

interface Props {
  params: { id: string };
}

const EditUserInfoPage = async ({ params: { id } }: Props) => {
  const session = await getSession();
  authorizeUser(session!);

  if (id !== session?.user.id) redirect("/");

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) notFound();

  return (
    <div className="px-5 py-2">
      <EditUserInfoForm user={user} />
    </div>
  );
};

export default EditUserInfoPage;
