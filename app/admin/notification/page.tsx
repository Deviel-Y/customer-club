import NotificationActionBar from "@/app/components/NotificationActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { NotificationSection, NotificationType } from "@prisma/client";
import NotificationListTable from "../../components/NotificationListTable";

interface Props {
  searchParams: {
    type: NotificationType;
    section: NotificationSection;
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
    pageNumber,
  },
}: Props) => {
  const session = await getSession();
  authorizeAdmin(session!);

  const prismaNotificationType = Object.values(NotificationType);
  const notificationType = prismaNotificationType.includes(type)
    ? type
    : undefined;

  const prismaAssigneToSection = Object.values(NotificationSection);
  const notificationSection = prismaAssigneToSection.includes(section)
    ? section
    : undefined;

  const currentPage = pageNumber || 1;

  const [notification, notificationCount, authenticatedUser] =
    await prisma.$transaction([
      prisma.notification.findMany({
        where: {
          assignedToSection: { equals: notificationSection },
          users: {
            some: {
              companyName: { contains: companyName },
              companyBranch: { contains: companyBranch },
            },
          },
          message: { contains: content },
          type: { equals: notificationType },
          isRead: false,
        },
        include: { users: true },
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        orderBy: { createdAt: "desc" },
      }),

      prisma.notification.count({
        where: {
          assignedToSection: { equals: notificationSection },
          users: {
            some: {
              companyBranch: { contains: companyBranch },
              companyName: { contains: companyName },
            },
          },
          message: { contains: content },
          type: { equals: notificationType },
          isRead: false,
        },
      }),

      prisma.user.findUnique({
        where: { id: session?.user.id },
        select: { id: true, role: true },
      }),
    ]);

  return (
    <div className="flex flex-col px-5 py-2 w-full">
      <NotificationActionBar />

      <NotificationListTable
        userRole={session?.user.role!}
        user={authenticatedUser!}
        totalPage={Math.ceil(notificationCount / pageSize)}
        notifications={notification}
      />
    </div>
  );
};

export default AdminNotificationListPage;

const pageSize: number = 8;
