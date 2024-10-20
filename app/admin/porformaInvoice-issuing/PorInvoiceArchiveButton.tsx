import {
  archivePorInvoiceDate,
  ArchivePorInvoiceDateType,
} from "@/app/libs/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Button,
  DatePicker,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

type DateType = { fromDate?: string; toDate?: string };

const PorInvoiceArchiveButton = () => {
  const router = useRouter();
  const [dates, setDates] = useState<DateType>();

  const { control, handleSubmit } = useForm<ArchivePorInvoiceDateType>({
    resolver: zodResolver(archivePorInvoiceDate),
  });
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button size="sm" color="secondary">
            بایگانی پیش فاکتور
          </Button>
        </PopoverTrigger>

        <PopoverContent className="shadow-large w-[600px] flex flex-col gap-y-4 p-3">
          <h2 className="text-lg mb-3 self-start">فرم بایگانی پیش فاکتور ها</h2>
          <form
            className="flex flex-col gap-3 items-start justify-center w-full"
            onSubmit={handleSubmit((data) => {
              const promise = axios
                .post("/api/archivedPorInvoice", data)
                .finally(() => router.refresh());

              toast.promise(promise, {
                loading: "در حال بایگانی پیش فاکتور ها",
                success: "پیش فاکتور ها با موفقیت بایگانی شدند",
                error: (error: AxiosError) => error.response?.data as string,
              });
            })}
          >
            <div className="flex-row flex gap-3 w-full">
              <Controller
                control={control}
                name="fromDate"
                render={({ field: { onChange } }) => (
                  <DatePicker
                    isRequired
                    size="sm"
                    label="از تاریخ"
                    value={today(getLocalTimeZone())}
                    onChange={(value) => {
                      const formattedDate = value
                        .toDate(getLocalTimeZone())
                        .toISOString();
                      onChange(formattedDate);
                      setDates({ ...dates, fromDate: formattedDate });
                    }}
                    description={`تاریخ شمسی : ${
                      moment(dates?.fromDate).format("jYYYY/jMM/jDD") ||
                      moment(Date()).format("jYYYY/jMM/jDD")
                    }`}
                  />
                )}
              />

              <Controller
                control={control}
                name="toDate"
                render={({ field: { onChange } }) => (
                  <DatePicker
                    isRequired
                    size="sm"
                    label="تا تاریخ"
                    value={today(getLocalTimeZone())}
                    onChange={(value) => {
                      const formattedDate = value
                        .toDate(getLocalTimeZone())
                        .toISOString();
                      onChange(formattedDate);
                      setDates({ ...dates, toDate: formattedDate });
                    }}
                    description={`تاریخ شمسی : ${
                      moment(dates?.toDate).format("jYYYY/jMM/jDD") ||
                      moment(Date()).format("jYYYY/jMM/jDD")
                    }`}
                  />
                )}
              />
            </div>

            <div className="flex flex-row gap-5">
              <Button color="primary" type="submit">
                بایگانی
              </Button>

              <Button
                onPress={() => router.push("/admin/archived-porforma-invoices")}
                color="secondary"
                type="button"
              >
                پیش فاکتور های بایگانی شده
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
      <Toaster />
    </>
  );
};

export default PorInvoiceArchiveButton;
