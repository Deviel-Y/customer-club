"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  Input,
} from "@nextui-org/react";
import { Invoice, User } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import FormErrorMessage from "../../components/FormErrorMessage";
import { invoiceSchema, InvoiceSchemaType } from "../../libs/validationSchema";

interface Props {
  Userlist: User[];
  invoice?: Invoice;
}

const InvoiceForm = ({ Userlist, invoice }: Props) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>();
  const organization = Userlist.find((user) => user.id == userId)?.companyName;

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
      onSubmit={handleSubmit(({ invoiceNumber, ...data }) => {
        const promise = invoice
          ? axios
              .patch(`/api/invoice/${invoice.id}`, {
                invoiceNumber: invoiceNumber.trim(),
                organization,
                ...data,
              })
              .then(() => {
                router.push("/admin/invoice-issuing");
                router.refresh();
              })
          : axios
              .post("/api/invoice", {
                invoiceNumber: invoiceNumber.trim(),
                organization,
                ...data,
              })
              .then(() => {
                router.push("/admin/invoice-issuing");
                router.refresh();
              });

        toast.promise(promise, {
          error: (error: AxiosError) => error.response?.data as string,
          loading: invoice ? "در حال ویرایش فاکتور" : "در حال صدور فاکتور",
          success: invoice
            ? "فاکتور با موفقیت ویرایش شد"
            : "فاکتور با موفقیت صادر شد",
        });
      })}
      className="flex justify-center items-center"
    >
      <Card className="flex flex-col p-5 gap-2 w-4/5">
        <div>
          <h2 className="text-[25px]">اطلاعات فاکتور</h2>
        </div>

        <div className="grid grid-cols-4 grid-rows-2 gap-3 place-items-center">
          <div className="col-span-1 w-full">
            <Input
              size="lg"
              defaultValue={invoice?.invoiceNumber}
              {...register("invoiceNumber")}
              isRequired
              label="شماره فاکتور"
            />

            <FormErrorMessage errorMessage={errors.invoiceNumber?.message!} />
          </div>

          <div className="col-span-1 w-full">
            <Controller
              name="assignedToUserId"
              control={control}
              defaultValue={invoice?.organization}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  onSelectionChange={(value) => {
                    onChange(value);
                    setUserId(value as string);
                  }}
                  isRequired
                  size="lg"
                  label="نام سازمان"
                >
                  {Userlist?.map((user) => (
                    <AutocompleteItem key={user.id}>
                      {user.companyName}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              )}
            />

            <FormErrorMessage
              errorMessage={errors.assignedToUserId?.message!}
            />
          </div>

          <div className="col-span-1 w-full">
            <Input
              size="lg"
              {...register("organizationBranch")}
              defaultValue={invoice?.organizationBranch}
              isRequired
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
              size="lg"
              defaultValue={invoice?.description}
              {...register("description")}
              isRequired
              label="توضیحات فاکتور"
            />

            <FormErrorMessage errorMessage={errors?.description?.message!} />
          </div>
        </div>

        <div className="flex flex-row justify-start !items-center gap-5 mt-5">
          <Button type="submit" color="primary" variant="shadow">
            {invoice ? "ویرایش فاکتور" : "صدور فاکتور جدید"}
          </Button>

          <Button
            onPress={() => router.push("/admin/invoice-issuing")}
            color="danger"
            variant="light"
          >
            انصراف
          </Button>
        </div>
      </Card>
      <Toaster />
    </form>
  );
};

export default InvoiceForm;