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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

type DateType = { fromDate?: string; toDate?: string };

const DeletePorInvoiceButton = () => {
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
          <Button size="sm" color="danger" variant="light">
            حذف دسته ای پیش فاکتورها
          </Button>
        </PopoverTrigger>

        <PopoverContent className="shadow-large w-[600px] flex flex-col gap-y-4 p-3">
          <h2 className="text-lg mb-3 self-start">فرم حذف پیش فاکتور ها</h2>
          <form
            className="flex flex-row gap-3 items-center justify-center w-full"
            onSubmit={handleSubmit((data) => {
              setIsLoading(true);

              axios
                .delete(
                  "/api/porformaInvoice/archivedPorInvoice/Delete-archived-PorInvoiceRange",
                  {
                    data: data,
                  }
                )
                .then(() => {
                  toast.success("پیش فاکتورها با موفقیت حذف شدند");
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
                    color="danger"
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
                    color="danger"
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
              color="danger"
              type="submit"
              variant="shadow"
            >
              حذف
            </Button>
          </form>
        </PopoverContent>
      </Popover>
      <Toaster />
    </>
  );
};

export default DeletePorInvoiceButton;