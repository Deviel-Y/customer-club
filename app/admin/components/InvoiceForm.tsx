"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  Checkbox,
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const [price, setPrice] = useState<string>(invoice?.price?.toString() || "0");
  const [hasTax, setHasTax] = useState<boolean>(invoice?.tax !== 0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InvoiceSchemaType>({
    resolver: zodResolver(invoiceSchema),
  });

  const submitHandler = handleSubmit(
    ({ invoiceNumber, sendNotification, ...data }) => {
      const assignedToUserId = Userlist.find(
        (user) =>
          user.companyName === companyName &&
          user.companyBranch === companyBranch
      )?.id;

      setIsLoading(true);

      invoice
        ? axios
            .patch(`/api/invoice/${invoice.id}`, {
              invoiceNumber: invoiceNumber.trim(),
              assignedToUserId,
              sendNotification: sendNotification,
              ...data,
            })
            .then(() => {
              toast.success("فاکتور با موفقیت ویرایش شد");
              setTimeout(() => {
                router.push("/admin/invoice-issuing");
                router.refresh();
              }, 2000);
            })
            .catch((error: AxiosError) => {
              setIsLoading(false);
              toast.error(error.response?.data as string);
            })
        : axios
            .post("/api/invoice", {
              invoiceNumber: invoiceNumber.trim(),
              sendNotification: sendNotification,
              assignedToUserId,
              ...data,
            })
            .then(() => {
              toast.success("فاکتور با موفقیت صادر شد");
              setTimeout(() => {
                router.push("/admin/invoice-issuing");
                router.refresh();
              }, 2000);
            })
            .catch((error: AxiosError) => {
              setIsLoading(false);
              toast.error(error.response?.data as string);
            });
    }
  );

  return (
    <form
      onSubmit={submitHandler}
      className="flex justify-center items-center max-sm:w-full"
    >
      <Card className="flex flex-col p-5 max-sm:p-2 w-4/5">
        <h2 className="text-[25px] max-sm:text-[20px] mb-5">اطلاعات فاکتور</h2>

        <div className="grid grid-cols-3 grid-rows-3 max-md:grid-cols-1 max-md:grid-rows-8 gap-1 max-md:gap-0 place-items-center">
          <div className="w-full">
            <Input
              defaultValue={invoice?.invoiceNumber}
              {...register("invoiceNumber")}
              isRequired
              type="number"
              label="شماره فاکتور"
            />

            <FormErrorMessage errorMessage={errors.invoiceNumber?.message!} />
          </div>

          <div className="w-full">
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

          <div className="w-full">
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

          <div className="w-full -translate-y-3">
            <Controller
              control={control}
              defaultValue={invoice?.tax !== 0}
              name="invoiceHasTax"
              render={({ field: { onChange } }) => (
                <Checkbox
                  defaultSelected={invoice?.tax !== 0}
                  size="sm"
                  onChange={(event) => {
                    onChange(event.target.checked);
                    setHasTax(event.target.checked);
                  }}
                >
                  فاکتور دارای مالیات می باشد
                </Checkbox>
              )}
            />

            <Input
              onValueChange={setPrice}
              defaultValue={invoice?.price.toString()}
              {...register("price", { valueAsNumber: true })}
              isRequired
              type="number"
              label="مبلغ خام فاکتور"
            />

            <FormErrorMessage errorMessage={errors.price?.message!} />
          </div>

          <div className="w-full">
            <Input
              className="-translate-y-3"
              isDisabled
              value={hasTax ? (Number(price) * 0.1).toFixed(0).toString() : "0"}
              defaultValue={invoice?.tax?.toString() || "0"}
              isRequired
              label="%10 مالیات بر ارزش افزوده"
            />
          </div>

          <div className="w-full">
            <Input
              className="-translate-y-3"
              isRequired
              isDisabled
              value={hasTax ? (Number(price) * 1.1).toFixed(0) : price}
              defaultValue={invoice?.priceWithTax?.toString() || "0"}
              label="مبلغ کل فاکتور"
            />
          </div>

          <div className="col-span-2 place-content-center place-items-start max-md:col-span-1 w-full">
            <Input
              defaultValue={invoice?.description}
              {...register("description")}
              isRequired
              label="توضیحات فاکتور"
            />

            <FormErrorMessage errorMessage={errors?.description?.message!} />
          </div>

          <div className="w-full">
            <Controller
              control={control}
              defaultValue={true}
              name="sendNotification"
              render={({ field: { onChange } }) => (
                <Autocomplete
                  defaultSelectedKey={"true"}
                  label="اعلان برای کاربر ارسال شود؟"
                  onSelectionChange={(value) =>
                    onChange(JSON.parse(String(value)))
                  }
                >
                  <AutocompleteItem key={"true"}>بله</AutocompleteItem>
                  <AutocompleteItem key={"false"}>خیر</AutocompleteItem>
                </Autocomplete>
              )}
            />
            <FormErrorMessage
              errorMessage={errors.sendNotification?.message!}
            />
          </div>
        </div>

        <div className="flex flex-row max-sm:flex-col-reverse justify-between items-center gap-5 mt-5 max-sm:-mt-3">
          <div className="flex flex-row gap-5 max-sm:justify-between max-sm:mt-3">
            <Button
              isLoading={isLoading}
              type="submit"
              color="primary"
              variant="shadow"
            >
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

          <Button color="secondary" className="max-sm:w-full">
            بارگذاری فایل فاکتور
          </Button>
        </div>
      </Card>
      <Toaster />
    </form>
  );
};

export default InvoiceForm;
