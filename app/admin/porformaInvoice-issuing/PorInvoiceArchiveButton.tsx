import {
  Button,
  DatePicker,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";

const PorInvoiceArchiveButton = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" color="secondary">
          بایگانی پیش فاکتور
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <div className="flex flex-row gap-3 m-2 items-center">
          <DatePicker size="sm" label="از تاریخ" />
          <DatePicker size="sm" label="تا تاریخ" />
          <Button color="primary">بایگانی</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PorInvoiceArchiveButton;
