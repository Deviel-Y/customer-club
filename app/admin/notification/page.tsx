import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { NotificationType, Section } from "@prisma/client";
import NotificationListTable from "./NotificationListTable";

interface Props {
  searchParams: {
    notificationType: NotificationType;
    assigneToSection: Section;
    companyName: string;
    companyBranch: string;
    message: string;
    readStatus: boolean;
    pageNumber: number;
  };
}

const AdminNotificationListPage = async ({
  searchParams: {
    assigneToSection,
    companyBranch,
    companyName,
    message,
    notificationType,
    pageNumber,
  },
}: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const prismaNotificationType = Object.values(NotificationType);
  const type = prismaNotificationType.includes(notificationType)
    ? notificationType
    : undefined;

  const prismaAssigneToSection = Object.values(Section);
  const section = prismaAssigneToSection.includes(assigneToSection)
    ? assigneToSection
    : undefined;

  const currentPage = pageNumber || 1;
  const pageSize: number = 6;

  const notification = await prisma.notification.findMany({
    where: {
      assignedToSection: { equals: section as Section },
      user: {
        companyBranch: { contains: companyBranch },
        companyName: { contains: companyName },
      },
      message: { contains: message },
      type: { equals: type as NotificationType },
    },

    include: { user: true },
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { createdAt: "desc" },
  });

  const notificationCount = await prisma.notification.count({
    where: {
      assignedToSection: { equals: section as Section },
      user: {
        companyBranch: { contains: companyBranch },
        companyName: { contains: companyName },
      },
      message: { contains: message },
      type: { equals: type as NotificationType },
    },
  });

  return (
    <div className="flex flex-col gap-5 px-5 py-2 w-full">
      <NotificationListTable
        totalPage={Math.ceil(notificationCount / pageSize)}
        notifications={notification}
      />
    </div>
  );
};

export default AdminNotificationListPage;
