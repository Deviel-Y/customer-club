import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@nextui-org/react";

const NewTicketPopoverButton = () => {
  return (
    <Popover className="w-[700px]" size="lg" showArrow>
      <PopoverTrigger>
        <Button color="secondary" size="lg">
          ثبت تیکت جدید
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <form className="w-full flex flex-col gap-6 p-3">
          <h2 className="text-[25px]">فرم تیکت</h2>

          <div className="flex flex-col gap-2">
            <Input isRequired label="عنوان" />

            <Input isRequired label="موضوع" />

            <Textarea isRequired label="توضیحات" />
          </div>

          <div>
            <Button size="lg" color="primary">
              ثبت
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default NewTicketPopoverButton;
