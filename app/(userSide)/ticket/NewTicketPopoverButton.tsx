"use client";

import { TicketSchemaType } from "@/app/libs/validationSchema";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@nextui-org/react";
import { Category, Ticket } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
  FcCustomerSupport,
  FcFaq,
  FcMoneyTransfer,
  FcSupport,
} from "react-icons/fc";

const NewTicketPopoverButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ticketCategories = Object.values(Category);
  const [textAreaValue, setTextAreaValue] = useState<string>();
  const { register, handleSubmit, control } = useForm<TicketSchemaType>();

  return (
    <>
      <Popover className="w-[700px]" size="lg" showArrow>
        <PopoverTrigger>
          <Button color="secondary" size="lg">
            ثبت تیکت جدید
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <form
            className="w-full flex flex-col gap-6 p-3"
            onSubmit={handleSubmit(({ category, title }) => {
              setIsLoading(true);

              const myRequest = axios
                .post<Ticket>("/api/ticket", { title, category })
                .then((res) => {
                  const ticket = res.data;

                  axios.post("/api/ticket/ticketMessage", {
                    message: textAreaValue,
                    assignetoTicketId: ticket.id,
                  });
                  router.push("/ticket");
                  router.refresh();
                })
                .finally(() => {
                  setIsLoading(false);
                });

              toast.promise(myRequest, {
                error: (error: AxiosError) => error?.response?.data as string,
                loading: "در حال ثبت درخواست",
                success: "درخواست شما با موفقیت ثبت شد",
              });
            })}
          >
            <h2 className="text-[25px]">فرم تیکت</h2>

            <div className="flex flex-col gap-2">
              <Input {...register("title")} isRequired label="عنوان" />

              <Controller
                control={control}
                name="category"
                render={({ field: { onChange } }) => (
                  <Autocomplete
                    onSelectionChange={onChange}
                    isRequired
                    label="دسته بندی"
                    listboxProps={{ emptyContent: "دسته بندی یافت نشد" }}
                  >
                    {ticketCategories.map((category) => (
                      <AutocompleteItem
                        key={category}
                        endContent={categoryMapping[category].icon}
                      >
                        {categoryMapping[category].label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
              />

              <Textarea
                onValueChange={setTextAreaValue}
                isRequired
                label="توضیحات"
              />
            </div>

            <div>
              <Button
                isLoading={isLoading}
                type="submit"
                size="lg"
                color="primary"
              >
                ثبت
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
      <Toaster />
    </>
  );
};

export default NewTicketPopoverButton;

const categoryMapping: Record<Category, { label: string; icon: JSX.Element }> =
  {
    FEATURE_REQUEST: {
      label: "درخواست ویژگی جدید",
      icon: <FcSupport size={20} />,
    },
    GENERAL_INQUIRY: { label: "سوالات عمومی", icon: <FcFaq size={20} /> },
    PAYMENT: {
      label: "صورتحساب و پردخت ها",
      icon: <FcMoneyTransfer size={20} />,
    },
    TECHNICAL_SUPPORT: {
      label: "پشتیبانی فنی",
      icon: <FcCustomerSupport size={20} />,
    },
  };
