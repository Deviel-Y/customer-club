import NotificationActionBar from "@/app/components/NotificationActionBar";
import getSession from "@/app/libs/getSession";
import { authorizeUser } from "@/app/utils/authorizeRole";
import prisma from "@/prisma/client";
import { NotificationType, Section } from "@prisma/client";
import { subMonths } from "date-fns";
import NotificationListTable from "../../components/NotificationListTable";

interface Props {
  searchParams: {
    type: NotificationType;
    section: Section;
    companyName: string;
    companyBranch: string;
    content: string;
    readStatus: boolean;
    pageNumber: number;
  };
}

const UserNotificationListPage = async ({
  searchParams: { section, content, type, pageNumber },
}: Props) => {
  const session = await getSession();
  authorizeUser(session!);

  // Delete notification that two or more months old
  const currentDate = new Date();
  const twoMonthsFromNow = subMonths(currentDate, 2);
  await prisma.notification.deleteMany({
    where: { createdAt: { lte: twoMonthsFromNow } },
  });

  //Assure that user sends proper notification type to back-end
  const prismaNotificationType = Object.values(NotificationType);
  const notificationType = prismaNotificationType.includes(type)
    ? type
    : undefined;

  //Assure that user sends proper notification section to back-end as well
  const prismaAssigneToSection = Object.values(Section);
  const notificationSection = prismaAssigneToSection.includes(section)
    ? section
    : undefined;

  const currentPage = pageNumber || 1;

  const [notification, notificationCount, authenticatedUser] =
    //notification
    await prisma.$transaction([
      prisma.notification.findMany({
        where: {
          users: { some: { id: session?.user.id } },
          assignedToSection: { equals: notificationSection },
          message: { contains: content },
          type: { equals: notificationType },
          isRead: false,
        },
        include: { users: true },
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        orderBy: { createdAt: "desc" },
      }),

      //notificationCount
      prisma.notification.count({
        where: {
          users: { some: { id: session?.user.id } },
          assignedToSection: { equals: notificationSection },
          message: { contains: content },
          type: { equals: notificationType },
          isRead: false,
        },
      }),

      //authenticatedUser
      prisma.user.findUnique({ where: { id: session?.user.id } }),
    ]);

  return (
    <div className="flex flex-col px-5 py-2 w-full">
      <NotificationActionBar isAdmin={false} />

      <NotificationListTable
        userRole={session?.user.role!}
        user={authenticatedUser!}
        totalPage={Math.ceil(notificationCount / pageSize)}
        notifications={notification}
      />
    </div>
  );
};

export default UserNotificationListPage;

const pageSize: number = 10;
