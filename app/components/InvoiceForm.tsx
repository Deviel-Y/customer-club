"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  Input,
  Textarea,
} from "@nextui-org/react";
import { User } from "@prisma/client";
import { Toaster } from "react-hot-toast";

interface Props {
  Userlist: User[];
}

const InvoiceForm = ({ Userlist }: Props) => {
  return (
    <form className="flex justify-center items-center">
      <Card className="flex flex-col p-5 w-4/5">
        <div>
          <h2 className="text-[25px]">اطلاعات فاکتور</h2>
        </div>

        <div className="grid grid-cols-4 grid-rows-2 gap-3 place-items-center">
          <div className="col-span-1 w-full">
            <Input isRequired type="email" label="شماره فاکتور" />
          </div>

          <div className="col-span-1 w-full">
            <Autocomplete isRequired size="md" label="نام سازمان">
              {Userlist?.map((user) => (
                <AutocompleteItem key={user.id}>
                  {user.companyName}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>

          <div className="col-span-1 w-full">
            <Input isRequired size="md" label="نام شعبه" />
          </div>

          <div className="col-span-1 w-full">
            <Button className="w-full" size="lg" color="secondary">
              بارگذاری فایل فاکتور
            </Button>
          </div>

          <div className="col-span-4 w-full">
            <Textarea isRequired size="md" label="توضیحات فاکتور" />
          </div>
        </div>

        <div className="flex flex-row gap-5 mt-5">
          <Button type="submit" color="primary" variant="shadow">
            صدور فاکتور جدید
          </Button>

          <Button color="danger" variant="light">
            انصراف
          </Button>
        </div>
      </Card>
      <Toaster />
    </form>
  );
};

export default InvoiceForm;
