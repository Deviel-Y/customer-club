import { Button, Textarea } from "@nextui-org/react";

const NewTicketMessagaForm = () => {
  return (
    <form className="flex flex-col items-start gap-5 mt-10 w-4/5">
      <Textarea variant="bordered" label="متن پاسخ" className="w-2/3" />

      <Button color="primary" size="lg">
        ارسال پاسخ
      </Button>
    </form>
  );
};

export default NewTicketMessagaForm;
