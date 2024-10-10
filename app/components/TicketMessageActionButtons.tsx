import { TicketMessage } from "@prisma/client";
import { DeleteConfirmationButton } from "./DeleteConfirmationButton";
import EditTicketMessagePopover from "./EditTicketMessagePopover";

interface Props {
  ticketMessage: TicketMessage;
}

const TicketMessageActionButtons = ({ ticketMessage }: Props) => {
  return (
    <div className="opacity-0 mx-2 transition-all flex flex-col gap-2 group-hover:opacity-100">
      <EditTicketMessagePopover ticketMessage={ticketMessage} />

      <DeleteConfirmationButton
        content="آیا از حذف  پاسخ خود مطمئن اید؟"
        endpoint={`/api/ticket/ticketMessage/${ticketMessage.id}`}
        successMessage="پاسخ با موفقیت حذف شد"
        title="حذف پاسخ"
        iconStyle="w-6 stroke-[1.3px]"
        buttonSize="sm"
      />
    </div>
  );
};

export default TicketMessageActionButtons;
