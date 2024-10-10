"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@nextui-org/react";
import { TicketMessage } from "@prisma/client";
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
  ticketMessage: TicketMessage;
}

const EditTicketMessagePopover = ({ ticketMessage }: Props) => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketMessageSchemaType>({
    resolver: zodResolver(ticketMessageSchema),
  });

  return (
    <>
      <Popover className="w-96">
        <PopoverTrigger>
          <Button size="sm" color="warning" isIconOnly>
            <PencilSquareIcon className="w-6 stroke-[1.3px]" />
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <form
            onSubmit={handleSubmit((data) => {
              setisLoading(true);

              const myPromise = axios
                .patch(`/api/ticket/ticketMessage/${ticketMessage.id}`, data)
                .then(() => router.refresh())
                .finally(() => setisLoading(false));

              toast.promise(myPromise, {
                error: (error: AxiosError) => error.response?.data as string,
                loading: "در حال ویرایش پاسخ",
                success: "متن پاسخ با موفقیت ویرایش شد",
              });
            })}
            className="flex flex-col w-full"
          >
            <Textarea
              defaultValue={ticketMessage?.message}
              {...register("message")}
              variant="bordered"
              label="متن پاسخ"
              className="w-full"
            />
            <FormErrorMessage errorMessage={errors.message?.message!} />

            <Button type="submit" isLoading={isLoading} color="secondary">
              ویرایش پاسخ
            </Button>
          </form>
        </PopoverContent>
      </Popover>
      <Toaster />
    </>
  );
};

export default EditTicketMessagePopover;
