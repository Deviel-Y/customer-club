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
import FormErrorMessage from "./FormErrorMessage";

interface Props {
  ticketId: string;
}

const NewTicketMessagaForm = ({ ticketId }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketMessageSchemaType>({
    resolver: zodResolver(ticketMessageSchema),
  });

  return (
    <>
      <form
        className="flex flex-row items-end justify-start mt-10 gap-5 w-full"
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
      >
        <div className="w-1/2">
          <Textarea
            {...register("message")}
            size="lg"
            variant="bordered"
            label="متن پاسخ"
            className="w-full"
          />
          <FormErrorMessage errorMessage={errors.message?.message!} />
        </div>

        <Button
          className="-translate-y-5"
          type="submit"
          isLoading={isLoading}
          color="primary"
          size="lg"
        >
          ارسال پاسخ
        </Button>
      </form>
      <Toaster />
    </>
  );
};

export default NewTicketMessagaForm;
