"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Textarea } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
  ticketMessageSchema,
  TicketMessageSchemaType,
} from "../libs/validationSchema";

interface Props {
  ticketId: string;
}

const NewTicketMessagaForm = ({ ticketId }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { register, handleSubmit } = useForm<TicketMessageSchemaType>({
    resolver: zodResolver(ticketMessageSchema),
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(({ message }) => {
          setIsLoading(true);

          const myPromise = axios
            .post(`/api/ticket/ticketMessage`, {
              message,
              assignetoTicketId: ticketId,
            })
            .then(() => {
              router.push("/admin/ticket");
              router.refresh();
            })
            .finally(() => setIsLoading(false));

          toast.promise(myPromise, {
            error: (error: AxiosError) => error.response?.data as string,
            loading: "در حال ارسال پاسخ",
            success: "پاسخ با موفقیت رسال شد",
          });
        })}
        className="flex flex-col items-start gap-5 mt-10 w-4/5"
      >
        <Textarea
          {...register("message")}
          size="lg"
          variant="bordered"
          label="متن پاسخ"
          className="w-2/3"
        />

        <Button type="submit" isLoading={isLoading} color="primary" size="lg">
          ارسال پاسخ
        </Button>
      </form>
      <Toaster />
    </>
  );
};

export default NewTicketMessagaForm;
