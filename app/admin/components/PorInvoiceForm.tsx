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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
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
      onSubmit={handleSubmit((data) => {
        console.log(data);
        // const promise = PorInvoice
        //   ? axios
        //       .patch(`/api/invoice/${PorInvoice.id}`, {
        //         invoiceNumber: invoiceNumber.trim(),
        //         organization,
        //         ...data,
        //       })
        //       .then(() => {
        //         router.push("/admin/invoice-issuing");
        //         router.refresh();
        //       })
        //   : axios
        //       .post("/api/invoice", {
        //         invoiceNumber: invoiceNumber.trim(),
        //         organization,
        //         ...data,
        //       })
        //       .then(() => {
        //         router.push("/admin/invoice-issuing");
        //         router.refresh();
        //       });

        // toast.promise(promise, {
        //   error: (error: AxiosError) => error.response?.data as string,
        //   loading: PorInvoice ? "در حال ویرایش فاکتور" : "در حال صدور فاکتور",
        //   success: PorInvoice
        //     ? "فاکتور با موفقیت ویرایش شد"
        //     : "فاکتور با موفقیت صادر شد",
        // });
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
              defaultValue={PorInvoice?.organization}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  errorMessage={(value) =>
                    value.validationDetails.badInput
                      ? "تاریج معتبر نیست"
                      : undefined
                  }
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
                  minValue={today(getLocalTimeZone())}
                  defaultValue={today(getLocalTimeZone())}
                  onChange={(value) => {
                    const formattedDate = value
                      .toDate(getLocalTimeZone())
                      .toISOString();
                    onChange(formattedDate);
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
              label="توضیحات فاکتور"
            />

            <FormErrorMessage errorMessage={errors?.description?.message!} />
          </div>
        </div>

        <div className="flex flex-row justify-between items-center gap-5 mt-5">
          <div className="flex flex-row gap-5">
            <Button type="submit" color="primary" variant="shadow">
              {PorInvoice ? "ویرایش فاکتور" : "صدور فاکتور جدید"}
            </Button>

            <Button
              onPress={() => router.push("/admin/invoice-issuing")}
              color="danger"
              variant="light"
            >
              انصراف
            </Button>
          </div>

          <Button color="secondary">بارگذاری فایل فاکتور</Button>
        </div>
      </Card>
      <Toaster />
    </form>
  );
};

export default PorInvoiceForm;