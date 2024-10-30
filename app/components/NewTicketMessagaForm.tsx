"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Role, Ticket } from "@prisma/client";
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
  ticket: Ticket;
  userRole: Role;
}

const NewTicketMessagaForm = ({ userRole, ticket }: Props) => {
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
        className={`flex flex-row items-end justify-start max-md:flex-col mt-10 gap-2 w-full ${
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
        <div className="w-full">
          <Textarea
            {...register("message")}
            size="lg"
            variant="bordered"
            label="متن پاسخ"
            className="w-full"
          />
          <FormErrorMessage errorMessage={errors.message?.message!} />
        </div>

        <div className="w-full max-md:mt-6 flex flex-row gap-x-3">
          <Button
            className="-translate-y-6"
            type="submit"
            isLoading={isLoading}
            color="primary"
          >
            ارسال پاسخ
          </Button>

          <CloseTicketConfirmation userRole={userRole} ticket={ticket} />
        </div>
      </form>
      <Toaster />
    </>
  );
};

export default NewTicketMessagaForm;

const CloseTicketConfirmation = ({ userRole, ticket }: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        className={`-translate-y-6 ${userRole === "CUSTOMER" && "hidden"}`}
        type="button"
        isLoading={isLoading}
        color="danger"
        variant="light"
        onPress={() => onOpen()}
      >
        بستن تیکت
      </Button>
      <Modal
        hidden={userRole === "CUSTOMER"}
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader className="flex flex-col">بستن تیکت</ModalHeader>
              <ModalBody>
                <p>
                  آیا از بستن این تیکت مطمئن هستید؟ این عمل غیر قابل بازگشت می
                  باشد.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={isLoading}
                  color="primary"
                  variant="solid"
                  onPress={onClose}
                >
                  انصراف
                </Button>
                <Button
                  isLoading={isLoading}
                  color="danger"
                  onPress={() => {
                    setIsLoading(true);

                    axios
                      .patch(`/api/ticket/closeTicket/${ticket.id}`, {
                        ticketId: ticket.id,
                      })
                      .then(() => {
                        toast.success("تیکت با موفقیت بسته شد");
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
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
      <Toaster />
    </>
  );
};
