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
import { Key, useState } from "react";
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
  const [companyBranch, setCompanyBranch] = useState<Key | null>(
    invoice?.organizationBranch || ""
  );
  const [companyName, setCompanyName] = useState<Key>(
    invoice?.organization || ""
  );

  const companyNames = Userlist.map((user) => user.companyName);
  const uniqueCompanyName = companyNames.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

  const organizationBranch = Userlist.filter(
    (user) => user.companyName === companyName
  ).map((companyName) => companyName.companyBranch);

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
        const assignedToUserId = Userlist.find(
          (user) =>
            user.companyName === companyName &&
            user.companyBranch === companyBranch
        )?.id;
        if (!assignedToUserId) return toast("کاربر با این نام یافت نشد");

        const promise = invoice
          ? axios
              .patch(`/api/invoice/${invoice.id}`, {
                invoiceNumber: invoiceNumber.trim(),
                assignedToUserId,
                ...data,
              })
              .then(() => {
                router.push("/admin/invoice-issuing");
                router.refresh();
              })
          : axios
              .post("/api/invoice", {
                invoiceNumber: invoiceNumber.trim(),
                assignedToUserId,
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
          <h2 className="text-[25px] mb-5">اطلاعات فاکتور</h2>
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
              name="organization"
              control={control}
              defaultValue={invoice?.organization}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  listboxProps={{
                    emptyContent: "سازمانی یافت نشد",
                  }}
                  defaultSelectedKey={invoice?.organization}
                  onSelectionChange={(value) => {
                    onChange(value);
                    setCompanyName(value!);
                  }}
                  isRequired
                  size="lg"
                  label="نام سازمان"
                >
                  {uniqueCompanyName?.map((uniqueCompanyName) => (
                    <AutocompleteItem key={uniqueCompanyName!}>
                      {uniqueCompanyName}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              )}
            />

            <FormErrorMessage errorMessage={errors.organization?.message!} />
          </div>

          <div className="col-span-1 w-full">
            <Controller
              name="organizationBranch"
              defaultValue={invoice?.organizationBranch}
              control={control}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  listboxProps={{
                    emptyContent: "شعبه ای یافت نشد",
                  }}
                  defaultSelectedKey={invoice?.organizationBranch}
                  onSelectionChange={(value) => {
                    onChange(value);
                    setCompanyBranch(value);
                  }}
                  isRequired
                  size="lg"
                  label="نام شعبه"
                >
                  {organizationBranch?.map((organizationBranch) => (
                    <AutocompleteItem key={organizationBranch!}>
                      {organizationBranch}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              )}
            />

            <FormErrorMessage errorMessage={errors.organization?.message!} />
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
