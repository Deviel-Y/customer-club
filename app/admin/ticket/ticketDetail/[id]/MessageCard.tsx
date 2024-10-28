import TicketMessageActionButtons from "@/app/components/TicketMessageActionButtons";
import { Avatar, Card } from "@nextui-org/react";
import { TicketMessage, User } from "@prisma/client";
import moment from "moment-jalaali";

interface Props {
  ticketMessages: TicketMessage;
  users: User[];
  sessionId: string;
}

const MessageCard = ({ ticketMessages, users, sessionId }: Props) => {
  const messageIssuer: User = users.find(
    (user) => user?.id === ticketMessages?.issuerId
  )!;

  return (
    <div
      className={`w-full my-3 flex ${
        ticketMessages.messageType === "RESPONCE"
          ? "flex-row-reverse"
          : "flex-row"
      } gap-2 group`}
    >
      <div
        className={`flex flex-row w-full items-center ${
          ticketMessages.messageType === "REQUEST"
            ? "flex-row justify-start"
            : "flex-row-reverse justify-self-end"
        }`}
      >
        <div className="self-start">
          <Avatar
            className="mx-2"
            alt="Profile picture"
            src={messageIssuer.image || undefined}
          />
        </div>

        <Card className="col-span-3 px-4 py-2 w-2/3 max-md:w-full">
          <div
            className={`flex ${
              ticketMessages.messageType === "REQUEST"
                ? "flex-row"
                : "flex-row-reverse"
            } items-center justify-between`}
          >
            <div>
              <p>{messageIssuer?.companyName || messageIssuer.adminName}</p>

              <p
                className={`text-gray-500 text-[12px] ${
                  ticketMessages.messageType === "REQUEST"
                    ? "text-right"
                    : "text-left"
                }`}
              >
                {messageIssuer?.companyBranch || "ادمین"}
              </p>
            </div>

            <p className="text-sm text-gray-500">
              {moment(ticketMessages.createdAt).format("HH:mm jYYYY/jMM/jDD")}
            </p>
          </div>
          <p className="mt-3">{ticketMessages.message}</p>
        </Card>

        {ticketMessages.canBeModified && sessionId === messageIssuer?.id && (
          <TicketMessageActionButtons
            userRole={messageIssuer.role}
            ticketMessage={ticketMessages}
          />
        )}
      </div>
    </div>
  );
};

export default MessageCard;
