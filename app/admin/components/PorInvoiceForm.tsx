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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import FormErrorMessage from "../../components/FormErrorMessage";
import {
  porInvoiceSchema,
  PorInvoiceSchemaType,
} from "../../libs/validationSchema";

interface Props {
  Userlist: User[];
  PorInvoice?: PorformaInvoice;
}

const PorInvoiceForm = ({ Userlist, PorInvoice }: Props) => {
  const [date, setDate] = useState(
    moment(PorInvoice?.expiredAt).format("jYYYY/jMM/jDD")
  );
  const router = useRouter();
  const [userId, setUserId] = useState<string>();
  const organization = Userlist.find((user) => user.id == userId)?.companyName;

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
        const promise = PorInvoice
          ? axios
              .patch(`/api/porformaInvoice/${PorInvoice.id}`, {
                porformaInvoiceNumber: porformaInvoiceNumber.trim(),
                organization,
                ...data,
              })
              .then(() => {
                router.push("/admin/porformaInvoice-issuing");
                router.refresh();
              })
          : axios
              .post("/api/porformaInvoice", {
                porformaInvoiceNumber: porformaInvoiceNumber.trim(),
                organization,
                ...data,
              })
              .then(() => {
                router.push("/admin/porformaInvoice-issuing");
                router.refresh();
              });

        toast.promise(promise, {
          error: (error: AxiosError) => error.response?.data as string,
          loading: PorInvoice
            ? "در حال ویرایش پیش فاکتور"
            : "در حال صدور پیش فاکتور",
          success: PorInvoice
            ? "پیش فاکتور با موفقیت ویرایش شد"
            : "پیش فاکتور با موفقیت صادر شد",
        });
      })}
      className="flex justify-center items-center"
    >
      <Card className="flex flex-col p-5 gap-2 w-4/5">
        <div>
          <h2 className="text-[25px] mb-5">اطلاعات پیش فاکتور</h2>
        </div>

        <div className="grid grid-cols-4 grid-rows-2 gap-3 place-items-center">
          <div className="col-span-1 w-full">
            <Input
              size="lg"
              defaultValue={PorInvoice?.porformaInvoiceNumber}
              {...register("porformaInvoiceNumber")}
              isRequired
              label="شماره فاکتور"
            />

            <FormErrorMessage
              errorMessage={errors.porformaInvoiceNumber?.message!}
            />
          </div>

          <div className="col-span-1 w-full">
            <Controller
              name="assignedToUserId"
              control={control}
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
              defaultValue={PorInvoice?.organizationBranch}
              isRequired
              label="نام شعبه"
            />

            <FormErrorMessage
              errorMessage={errors.organizationBranch?.message!}
            />
          </div>

          <div className="col-span-1 w-full">
            <Controller
              control={control}
              name="expiredAt"
              render={({ field: { onChange } }) => (
                <DatePicker
                  className="translate-y-3"
                  description={`تاریخ شمسی : ${date}`}
                  minValue={today(getLocalTimeZone())}
                  defaultValue={today(getLocalTimeZone())}
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

          <div className="col-span-4 w-full">
            <Input
              size="lg"
              defaultValue={PorInvoice?.description}
              {...register("description")}
              isRequired
              label="توضیحات پیش فاکتور"
            />

            <FormErrorMessage errorMessage={errors?.description?.message!} />
          </div>
        </div>

        <div className="flex flex-row justify-between items-center gap-5 mt-5">
          <div className="flex flex-row gap-5">
            <Button type="submit" color="primary" variant="shadow">
              {PorInvoice ? "ویرایش پیش فاکتور" : "صدور پیش فاکتور جدید"}
            </Button>

            <Button
              onPress={() => router.push("/admin/invoice-issuing")}
              color="danger"
              variant="light"
            >
              انصراف
            </Button>
          </div>

          <Button color="secondary">بارگذاری فایل پیش فاکتور</Button>
        </div>
        <Toaster />
      </Card>
    </form>
  );
};

export default PorInvoiceForm;
