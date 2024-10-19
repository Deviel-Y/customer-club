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
import { Key, useEffect, useState } from "react";
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
  const [isInputsManual, setIsInputsManual] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<InvoiceSchemaType>({
    resolver: zodResolver(invoiceSchema),
  });

  useEffect(() => {
    if (!isInputsManual) {
      const calculatedTax = (parseInt(price) * 0.1).toFixed(0);
      const calculatedPriceWithTax = (
        parseInt(price) * 0.1 +
        parseInt(price)
      ).toFixed(0);

      setValue("tax", parseInt(calculatedTax));
      setValue("priceWithTax", parseInt(calculatedPriceWithTax));
    }
  }, [price, isInputsManual, setValue]);

  return (
    <form
      onSubmit={handleSubmit(({ invoiceNumber, ...data }) => {
        const assignedToUserId = Userlist.find(
          (user) =>
            user.companyName === companyName &&
            user.companyBranch === companyBranch
        )?.id;

        setIsLoading(true);

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
              .finally(() => setIsLoading(false))
          : axios
              .post("/api/invoice", {
                invoiceNumber: invoiceNumber.trim(),
                assignedToUserId,
                ...data,
              })
              .then(() => {
                router.push("/admin/invoice-issuing");
                router.refresh();
              })
              .finally(() => setIsLoading(false));

        toast.promise(promise, {
          error: (error: AxiosError) => error.response?.data as string,
          loading: invoice ? "در حال ویرایش فاکتور" : "در حال صدور فاکتور",
          success: invoice
            ? "فاکتور با موفقیت ویرایش شد"
            : "فاکتور با موفقیت صادر شد",
        });
      })}
      className="flex justify-center items-center max-sm:w-full"
    >
      <Card className="flex flex-col p-5 max-sm:p-2 gap-2 w-4/5">
        <div>
          <h2 className="text-[25px] max-sm:text-[20px] mb-5">
            اطلاعات فاکتور
          </h2>
        </div>

        <div className="grid grid-cols-3 grid-rows-3 max-md:grid-cols-1 max-md:grid-rows-4 gap-2 max-md:gap-0 place-items-center">
          <div className="w-full">
            <Input
              size="lg"
              defaultValue={invoice?.invoiceNumber}
              {...register("invoiceNumber")}
              isRequired
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

          <div className="w-full -translate-y-3">
            <Checkbox
              size="sm"
              onChange={(event) => setIsInputsManual(event.target.checked)}
            >
              وارد کردن مالیات به صورت دستی
            </Checkbox>
            <Input
              size="lg"
              onValueChange={setPrice}
              defaultValue={invoice?.price.toString()}
              {...register("price", { valueAsNumber: true })}
              isRequired
              type="number"
              label="مبلغ بدون مالیات"
            />

            <FormErrorMessage errorMessage={errors.price?.message!} />
          </div>

          <div className="w-full">
            <Input
              isDisabled={!isInputsManual}
              size="lg"
              value={!isInputsManual ? undefined : undefined}
              defaultValue={invoice?.tax?.toString()}
              onValueChange={(value) =>
                isInputsManual && setValue("tax", parseInt(value))
              }
              {...register("tax", { valueAsNumber: true })}
              isRequired
              type="number"
              label="%10 مالیات بر ارزش افزوده"
            />

            <FormErrorMessage errorMessage={errors.tax?.message!} />
          </div>

          <div className="w-full">
            <Input
              isDisabled={!isInputsManual}
              size="lg"
              value={!isInputsManual ? undefined : undefined}
              defaultValue={invoice?.priceWithTax?.toString()}
              onValueChange={(value) =>
                isInputsManual && setValue("priceWithTax", parseInt(value))
              }
              {...register("priceWithTax", { valueAsNumber: true })}
              isRequired
              type="number"
              label="مبلغ با احتساب مالیات"
            />

            <FormErrorMessage errorMessage={errors.priceWithTax?.message!} />
          </div>

          <div className="col-span-3 max-md:col-span-1 w-full">
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

        <div className="flex flex-row max-sm:flex-col-reverse justify-between items-center gap-5 mt-5 max-sm:-mt-3">
          <div className="flex flex-row gap-5 max-sm:gap-0 max-sm:mt-3">
            <Button
              isDisabled={isLoading}
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
