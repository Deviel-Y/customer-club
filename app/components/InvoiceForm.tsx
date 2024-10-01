"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  Input,
} from "@nextui-org/react";
import { User } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { invoiceSchema, InvoiceSchemaType } from "../libs/validationSchema";
import FormErrorMessage from "./FormErrorMessage";

interface Props {
  Userlist: User[];
}

const InvoiceForm = ({ Userlist }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InvoiceSchemaType>({
    resolver: zodResolver(invoiceSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => console.log(data))}
      className="flex justify-center items-center"
    >
      <Card className="flex flex-col p-5 gap-2 w-4/5">
        <div>
          <h2 className="text-[25px]">اطلاعات فاکتور</h2>
        </div>

        <div className="grid grid-cols-4 grid-rows-2 gap-3 place-items-center">
          <div className="col-span-1 w-full">
            <Input
              {...register("invoiceNumber")}
              isRequired
              label="شماره فاکتور"
            />

            <FormErrorMessage errorMessage={errors.invoiceNumber?.message!} />
          </div>

          <div className="col-span-1 w-full">
            <Controller
              name="organization"
              control={control}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  onSelectionChange={onChange}
                  isRequired
                  size="md"
                  label="نام سازمان"
                >
                  {Userlist?.map((user) => (
                    <AutocompleteItem key={user.companyName!}>
                      {user.companyName}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              )}
            />

            <FormErrorMessage errorMessage={errors.organization?.message!} />
          </div>

          <div className="col-span-1 w-full">
            <Input
              {...register("organizationBranch")}
              isRequired
              size="md"
              label="نام شعبه"
            />

            <FormErrorMessage
              errorMessage={errors.organizationBranch?.message!}
            />
          </div>

          <div className="col-span-1 w-full">
            <Button
              className="w-full -translate-y-3"
              size="lg"
              color="secondary"
            >
              بارگذاری فایل فاکتور
            </Button>
          </div>

          <div className="col-span-4 w-full">
            <Input
              {...register("description")}
              isRequired
              label="توضیحات فاکتور"
            />

            <FormErrorMessage errorMessage={errors?.description?.message!} />
          </div>
        </div>

        <div className="flex flex-row justify-start !items-center gap-5 mt-5">
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
