"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  DatePicker,
  Input,
} from "@nextui-org/react";
import { PorformaInvoice, User } from "@prisma/client";
import axios, { AxiosError } from "axios";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";
import { Key, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import FormErrorMessage from "../../components/FormErrorMessage";
import {
  porInvoiceSchema,
  PorInvoiceSchemaType,
} from "../../libs/validationSchema";

interface Props {
  Userlist: User[];
  porInvoice?: PorformaInvoice;
}

const PorInvoiceForm = ({ Userlist, porInvoice }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const initialDate =
    moment(porInvoice?.expiredAt).format("jYYYY/jMM/jDD") ||
    moment(new Date()).format("jYYYY/jMM/jDD");
  const [date, setDate] = useState(initialDate);

  const [companyBranch, setCompanyBranch] = useState<Key | null>(
    porInvoice?.organizationBranch || ""
  );
  const [companyName, setCompanyName] = useState<Key>(
    porInvoice?.organization || ""
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
  } = useForm<PorInvoiceSchemaType>({
    resolver: zodResolver(porInvoiceSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(({ porformaInvoiceNumber, ...data }) => {
        const assignedToUserId = Userlist.find(
          (user) =>
            user.companyName === companyName &&
            user.companyBranch === companyBranch
        )?.id;

        setIsLoading(true);

        porInvoice
          ? axios
              .patch(`/api/porformaInvoice/${porInvoice.id}`, {
                porformaInvoiceNumber: porformaInvoiceNumber.trim(),
                assignedToUserId,
                ...data,
              })
              .then(() => {
                toast.success("پیش فاکتور با موفقیت ویرایش شد");
                setTimeout(() => {
                  router.push("/admin/porformaInvoice-issuing");
                  router.refresh();
                }, 2000);
              })
              .catch((error: AxiosError) => {
                setIsLoading(false);
                toast.error(error.response?.data as string);
              })
          : axios
              .post("/api/porformaInvoice", {
                porformaInvoiceNumber: porformaInvoiceNumber.trim(),
                assignedToUserId,
                ...data,
              })
              .then(() => {
                toast.success("پیش فاکتور با موفقیت صادر شد");
                setTimeout(() => {
                  router.push("/admin/porformaInvoice-issuing");
                  router.refresh();
                }, 2000);
              })
              .catch((error: AxiosError) => {
                setIsLoading(false);
                toast.error(error.response?.data as string);
              });
      })}
      className="flex justify-center items-center"
    >
      <Card className="flex flex-col p-5 max-sm:p-2 w-4/5">
        <div>
          <h2 className="text-[25px] max-sm:text-[18px] mb-5 max-sm:mb-2">
            اطلاعات پیش فاکتور
          </h2>
        </div>

        <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 grid-rows-2 max-md:grid-rows-3 max-sm:grid-rows-5 gap-3 max-sm:gap-0 place-items-center">
          <div className="w-full">
            <Input
              size="lg"
              defaultValue={porInvoice?.porformaInvoiceNumber}
              {...register("porformaInvoiceNumber")}
              isRequired
              label="شماره فاکتور"
            />

            <FormErrorMessage
              errorMessage={errors.porformaInvoiceNumber?.message!}
            />
          </div>

          <div className="w-full">
            <Controller
              name="organization"
              control={control}
              defaultValue={porInvoice?.organization}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  listboxProps={{
                    emptyContent: "سازمانی یافت نشد",
                  }}
                  defaultSelectedKey={porInvoice?.organization}
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
              defaultValue={porInvoice?.organizationBranch}
              control={control}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  listboxProps={{
                    emptyContent: "شعبه ای یافت نشد",
                  }}
                  defaultSelectedKey={porInvoice?.organizationBranch}
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

          <div className="w-full">
            <Controller
              control={control}
              name="expiredAt"
              defaultValue={porInvoice?.expiredAt?.toISOString() || ""}
              render={({ field: { onChange } }) => (
                <DatePicker
                  isRequired
                  className="translate-y-3"
                  description={`تاریخ شمسی : ${date}`}
                  minValue={today(getLocalTimeZone())}
                  onChange={(value) => {
                    const formattedDate = value
                      .toDate(getLocalTimeZone())
                      .toISOString();
                    onChange(formattedDate);
                    setDate(moment(formattedDate).format("jYYYY/jMM/jDD"));
                  }}
                  size="lg"
                  label="تاریخ انقضا"
                />
              )}
            />

            <FormErrorMessage errorMessage={errors.expiredAt?.message!} />
          </div>

          <div className="col-span-4 max-md:col-span-2 max-sm:col-span-1 w-full">
            <Input
              size="lg"
              defaultValue={porInvoice?.description}
              {...register("description")}
              isRequired
              label="توضیحات پیش فاکتور"
            />

            <FormErrorMessage errorMessage={errors?.description?.message!} />
          </div>
        </div>

        <div className="flex flex-row max-sm:flex-col-reverse justify-between items-center gap-5 mt-5 max-sm:mt-1 max-sm:gap-8">
          <div className="flex flex-row gap-5 max-sm:gap-0">
            <Button
              isLoading={isLoading}
              type="submit"
              color="primary"
              variant="shadow"
            >
              {porInvoice ? "ویرایش پیش فاکتور" : "صدور پیش فاکتور جدید"}
            </Button>

            <Button
              onPress={() => router.push("/admin/porformaInvoice-issuing")}
              color="danger"
              variant="light"
            >
              انصراف
            </Button>
          </div>

          <Button className="max-sm:w-full" color="secondary">
            بارگذاری فایل پیش فاکتور
          </Button>
        </div>
      </Card>
      <Toaster />
    </form>
  );
};

export default PorInvoiceForm;
