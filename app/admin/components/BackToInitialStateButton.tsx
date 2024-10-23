import {
  ModifyPorInvoiceType,
  modifyPorInvoice,
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
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

type DateType = { fromDate?: string; toDate?: string };

const BackToInitialStateButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [dates, setDates] = useState<DateType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<ModifyPorInvoiceType>({
    resolver: zodResolver(modifyPorInvoice),
  });
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button size="sm" color="secondary" variant="light">
            {pathname.includes("porformaInvoice")
              ? "انتقال پیش فاکتورها"
              : "انتقال فاکتورها"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="shadow-large w-[600px] flex flex-col gap-y-4 p-3">
          <h2 className="text-lg mb-3 self-start">
            {pathname.includes("porformaInvoice")
              ? "فرم انتقال پیش فاکتورها"
              : "فرم انتقال فاکتورها"}
          </h2>
          <form
            className="flex flex-row gap-3 items-center justify-center w-full"
            onSubmit={handleSubmit((data) => {
              setIsLoading(true);

              axios
                .post(
                  `${
                    pathname.includes("porformaInvoice")
                      ? "/api/porformaInvoice/archivedPorInvoice/moveToInvoiceTable"
                      : "/api/Invoice/archivedPorInvoice/moveToInvoiceTable"
                  }`,
                  data
                )
                .then(() => {
                  toast.success(
                    `${
                      pathname.includes("porformaInvoice")
                        ? "پیش فاکتورها با موفقیت منتقل شدند"
                        : "فاکتورها با موفقیت منتقل شدند"
                    }`
                  );
                  router.refresh();
                })
                .catch((error: AxiosError) =>
                  toast.error(error.response?.data as string)
                )
                .finally(() => setIsLoading(false));
            })}
          >
            <div className="flex-row flex gap-3 w-full">
              <Controller
                control={control}
                name="fromDate"
                render={({ field: { onChange } }) => (
                  <DatePicker
                    showMonthAndYearPickers
                    isRequired
                    size="sm"
                    color="secondary"
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
                    showMonthAndYearPickers
                    isRequired
                    size="sm"
                    color="secondary"
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

            <Button
              isLoading={isLoading}
              className="-translate-y-3"
              color="secondary"
              type="submit"
              variant="shadow"
            >
              انتقال
            </Button>
          </form>
        </PopoverContent>
      </Popover>
      <Toaster />
    </>
  );
};

export default BackToInitialStateButton;
