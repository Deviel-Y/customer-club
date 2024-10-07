"use client";

import { ticketSchema, TicketSchemaType } from "@/app/libs/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@nextui-org/react";
import { Ticket } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

const NewTicketPopoverButton = () => {
  const router = useRouter();
  const [textAreaValue, setTextAreaValue] = useState<string>();

  const { register, handleSubmit } = useForm<TicketSchemaType>({
    resolver: zodResolver(ticketSchema),
  });

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
            onSubmit={handleSubmit(({ subject, title }) => {
              const myRequest = axios
                .post<Ticket>("/api/ticket", { title, subject })
                .then((res) => {
                  const ticket = res.data;

                  axios
                    .post("/api/ticket/ticketMessage", {
                      message: textAreaValue,
                      assignetoTicketId: ticket.id,
                    })
                    .catch((error: AxiosError) =>
                      toast.error(error?.response?.data as string)
                    );

                  router.push("/");
                  router.refresh();
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

              <Input {...register("subject")} isRequired label="موضوع" />

              <Textarea
                onValueChange={setTextAreaValue}
                isRequired
                label="توضیحات"
              />
            </div>

            <div>
              <Button type="submit" size="lg" color="primary">
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
