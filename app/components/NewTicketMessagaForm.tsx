"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Textarea } from "@nextui-org/react";
import { Ticket } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
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
  session: Session;
  ticket: Ticket;
}

const NewTicketMessagaForm = ({ ticket, session }: Props) => {
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
        className={`flex flex-row items-end justify-start mt-10 gap-2 w-full ${
          ticket.status === "CLOSED" && "hidden"
        }`}
        onSubmit={handleSubmit(({ message }) => {
          setIsLoading(true);

          const myPromise = axios
            .post(`/api/ticket/ticketMessage`, {
              message,
              assignetoTicketId: ticket.id,
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
          className="-translate-y-6"
          type="submit"
          isLoading={isLoading}
          color="primary"
        >
          ارسال پاسخ
        </Button>

        {session?.user?.role !== "CUSTOMER" && (
          <Button
            className="-translate-y-6"
            type="button"
            isLoading={isLoading}
            color="danger"
            variant="light"
            onPress={() => {
              setIsLoading(true);

              axios
                .patch(`/api/ticket/closeTicket/${ticket.id}`, {
                  ticketid: ticket.id,
                })
                .then(() => {
                  router.push("/admin/ticket");
                  router.refresh();
                })
                .catch((error: AxiosError) =>
                  toast.error(error.response?.data as string)
                )
                .finally(() => setIsLoading(false));
            }}
          >
            بستن تیکت
          </Button>
        )}
      </form>
      <Toaster />
    </>
  );
};

export default NewTicketMessagaForm;
