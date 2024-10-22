import NotificationActionBar from "@/app/components/NotificationActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeUser } from "@/app/utils/authorizeRole";
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

const UserNotificationListPage = async ({
  searchParams: { section, content, type, isRead, pageNumber },
}: Props) => {
  const session = await getSession();
  authorizeUser(session!);

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

  const [notification, notificationCount, authenticatedUser] =
    await prisma.$transaction([
      prisma.notification.findMany({
        where: {
          users: { some: { id: session?.user.id } },
          assignedToSection: { equals: notificationSection },
          message: { contains: content },
          type: { equals: notificationType },
          isRead: isReadNotification,
        },

        include: { users: true },
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        orderBy: { createdAt: "desc" },
      }),

      prisma.notification.count({
        where: {
          users: { some: { id: session?.user.id } },
          assignedToSection: { equals: notificationSection },
          message: { contains: content },
          type: { equals: notificationType },
          isRead: isReadNotification,
        },
      }),

      prisma.user.findUnique({ where: { id: session?.user.id } }),
    ]);

  return (
    <div className="flex flex-col px-5 py-2 w-full">
      <NotificationActionBar isAdmin={false} />

      <NotificationListTable
        user={authenticatedUser!}
        totalPage={Math.ceil(notificationCount / pageSize)}
        notifications={notification}
      />
    </div>
  );
};

export default UserNotificationListPage;

const pageSize: number = 8;
