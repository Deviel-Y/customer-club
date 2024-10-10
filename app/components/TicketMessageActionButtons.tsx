import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

interface Props {
  TicketMessageId: string;
}

const TicketMessageActionButtons = ({ TicketMessageId }: Props) => {
  return (
    <div className="opacity-0 mx-2 transition-all flex flex-col gap-2 group-hover:opacity-100">
      <Button size="sm" color="danger" isIconOnly>
        <TrashIcon className="w-6 stroke-[1.3px]" />
      </Button>

      <Button size="sm" color="success" isIconOnly>
        <PencilSquareIcon className="w-6 stroke-[1.3px]" />
      </Button>
    </div>
  );
};

export default TicketMessageActionButtons;
