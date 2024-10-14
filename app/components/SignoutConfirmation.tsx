import { PowerIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export const SignOutConfirmation = () => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full h-10 cursor-pointer bottom-3 flex overflow-clip rounded place-items-center gap-3 hover:bg-red-500 transition-all duration-[10ms]">
      <Link
        color="danger"
        className="bg-transparent p-0 group w-full h-full group"
        onPress={onOpen}
      >
        <PowerIcon className="transition-all stroke-[0.90px] min-w-[35px] w-[40px] ps-[4px] self-center group-hover:stroke-neutral-100 stroke-neutral-600" />
        <p className="transition-all whitespace-nowrap text-inherit tracking-wide w-full h-full translate-y-2 ms-3 text-neutral-600 group-hover:text-neutral-100">
          خروج
        </p>
      </Link>

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader className="flex flex-col">خروج</ModalHeader>
              <ModalBody>
                <p>آیا از خروج مطمئن هستید؟</p>
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
                    setisLoading(true);
                    signOut({ redirect: true, callbackUrl: "/" });
                  }}
                >
                  خروج
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
