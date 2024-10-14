import NotificationActionBar from "@/app/components/NotificationActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { NotificationType, Section } from "@prisma/client";
import NotificationListTable from "../../components/NotificationListTable";

interface Props {
  searchParams: {
    type: NotificationType;
    section: Section;
    companyName: string;
    companyBranch: string;
    content: string;
    readStatus: boolean;
    isRead: string;
    pageNumber: number;
  };
}

const AdminNotificationListPage = async ({
  searchParams: {
    section,
    companyBranch,
    companyName,
    content,
    type,
    isRead,
    pageNumber,
  },
}: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const prismaNotificationType = Object.values(NotificationType);
  const notificationType = prismaNotificationType.includes(type)
    ? type
    : undefined;

  const prismaAssigneToSection = Object.values(Section);
  const notificationSection = prismaAssigneToSection.includes(section)
    ? section
    : undefined;

  const isReadNotification =
    isRead === "true" ? true : isRead === "false" ? false : undefined;

  const currentPage = pageNumber || 1;

  const [notification, notificationCount] = await Promise.all([
    prisma.notification.findMany({
      where: {
        assignedToSection: { equals: notificationSection },
        user: {
          companyBranch: { contains: companyBranch },
          companyName: { contains: companyName },
        },
        message: { contains: content },
        type: { equals: notificationType },
        isRead: isReadNotification,
      },

      include: { user: true },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
      orderBy: { createdAt: "desc" },
    }),

    prisma.notification.count({
      where: {
        assignedToSection: { equals: notificationSection },
        user: {
          companyBranch: { contains: companyBranch },
          companyName: { contains: companyName },
        },
        message: { contains: content },
        type: { equals: notificationType },
        isRead: isReadNotification,
      },
    }),
  ]);

  return (
    <div className="flex flex-col px-5 py-2 w-full">
      <NotificationActionBar />

      <NotificationListTable
        totalPage={Math.ceil(notificationCount / pageSize)}
        notifications={notification}
      />
    </div>
  );
};

export default AdminNotificationListPage;

const pageSize: number = 9;
