import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { notFound, redirect } from "next/navigation";
import EditAdminProfileForm from "./EditAdminProfileForm";

interface Props {
  params: { id: string };
}

const EditAdminProfilePage = async ({ params: { id } }: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  if (id !== session?.user.id) redirect("/");

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) notFound();

  return (
    <div className="px-5 py-2">
      <EditAdminProfileForm user={user} />
    </div>
  );
};

export default EditAdminProfilePage;
