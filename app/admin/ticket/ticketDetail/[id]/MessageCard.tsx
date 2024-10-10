import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Card } from "@nextui-org/react";
import { Ticket, TicketMessage, User } from "@prisma/client";
import moment from "moment-jalaali";

interface Props {
  ticket: Ticket;
  ticketMessages: TicketMessage;
  users: User[];
}

const MessageCard = ({ ticket, ticketMessages, users }: Props) => {
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

        <Card className="col-span-3 px-4 py-2 w-2/3">
          <div
            className={`flex ${
              ticketMessages.messageType === "REQUEST"
                ? "flex-row"
                : "flex-row-reverse"
            } items-center justify-between`}
          >
            <div className="">
              <p>{messageIssuer?.companyName || "ادمین"}</p>

              <p
                className={`text-gray-500 text-[12px] ${
                  ticketMessages.messageType === "REQUEST"
                    ? "text-right"
                    : "text-left"
                }`}
              >
                {messageIssuer?.companyBranch || ""}
              </p>
            </div>

            <p className="text-sm text-gray-500">
              {moment(ticket.createdAt).format("jYYYY/jM/jD")}
            </p>
          </div>
          <p className="mt-3">{ticketMessages.message}</p>
        </Card>

        {ticketMessages.canBeModified && (
          <div className="opacity-0 mx-2 transition-all flex flex-col gap-2 group-hover:opacity-100">
            <Button size="sm" color="danger" isIconOnly>
              <TrashIcon className="w-6 stroke-[1.3px]" />
            </Button>

            <Button size="sm" color="success" isIconOnly>
              <PencilSquareIcon className="w-6 stroke-[1.3px]" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
