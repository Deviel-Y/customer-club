"use client";

import {
  SignInUserSchemaType,
  signInUserSchema,
} from "@/app/libs/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
  AiFillEyeInvisible,
  AiOutlineEye,
  AiOutlineMail,
} from "react-icons/ai";
import { BsKey } from "react-icons/bs";

const LoginForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInUserSchemaType>({
    resolver: zodResolver(signInUserSchema),
  });

  const onSubmit = async ({ phoneNumber, password }: SignInUserSchemaType) => {
    setLoading(true);
    const res = await signIn("credentials", {
      phoneNumber: phoneNumber,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("رمز عبور یا شماره همراه اشتباه است");
      setLoading(false);
    } else {
      router.push(session?.user.role === "ADMIN" ? "/admin" : "/");
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <form className="w-3/4 max-lg:w-5/6" onSubmit={handleSubmit(onSubmit)}>
        <Card isBlurred className="flex flex-col p-5" shadow="lg">
          <h1 className="font-bold text-[30px]">ورود</h1>
          <p className="text-[15px] mt-2 mb-5">برای ادامه وارد شوید</p>

          <Input
            {...register("phoneNumber", { valueAsNumber: false })}
            isRequired
            startContent={<AiOutlineMail size={19} />}
            size="lg"
            type="text"
            className="mb-3 !transition-all"
            label="شماره همراه"
            placeholder="...090"
            variant="underlined"
            isInvalid={!!errors.phoneNumber?.message}
          />
          <p
            className={`${
              errors.phoneNumber?.message?.length ? "opacity-100" : "opacity-0"
            } transition-opacity duration-250 ease-in-out -mt-3 mb-3 text-[13px] text-[#F31260] h-2`}
          >
            {errors.phoneNumber?.message}
          </p>

          <Input
            {...register("password")}
            size="lg"
            isRequired
            startContent={<BsKey size={19} />}
            type={isVisible ? "text" : "password"}
            label="رمز عبور"
            placeholder="رمز عبور خود را وارد کنید"
            variant="underlined"
            isInvalid={!!errors.password?.message}
            endContent={
              <Button
                onPress={() => setIsVisible(!isVisible)}
                size="sm"
                isIconOnly
                type="button"
                radius="full"
              >
                {isVisible ? (
                  <AiFillEyeInvisible size={19} />
                ) : (
                  <AiOutlineEye size={19} />
                )}
              </Button>
            }
          />
          <p
            className={`${
              errors.password?.message?.length ? "opacity-100" : "opacity-0"
            } transition-opacity duration-250 ease-in-out text-[13px] text-[#F31260] h-2`}
          >
            {errors.password?.message}
          </p>

          <Button
            size="lg"
            disabled={isLoading}
            isLoading={isLoading}
            type="submit"
            variant="solid"
            color="primary"
            className="mt-7"
          >
            ادامه
          </Button>
        </Card>
        <Toaster />
      </form>
    </div>
  );
};

export default LoginForm;
