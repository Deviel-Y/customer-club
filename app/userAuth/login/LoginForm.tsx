"use client";

import { SignInUserSchemaType, signInUserSchema } from "@/app/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
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
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInUserSchemaType>({
    resolver: zodResolver(signInUserSchema),
  });
  return (
    <div className="w-full flex justify-center items-center">
      <form
        className="w-2/3"
        onSubmit={handleSubmit(async (data) => {
          const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          });

          res?.error
            ? toast.error("رمز عبور یا آدرس ایمیل اشتباه است")
            : (setLoading(true),
              signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
              }).then(() => {
                router.push("/");
                router.refresh();
              }));
        })}
      >
        <Card isBlurred className="flex flex-col p-5" shadow="lg">
          <h1 className="font-bold text-[25px]">ورود</h1>

          <p className="text-[13px] mt-2 mb-5">برای ادامه وارد شوید</p>

          <Input
            {...register("email")}
            isRequired
            startContent={<AiOutlineMail size={19} />}
            size="lg"
            type="email"
            className="mb-3 !transition-all"
            label="آدرس ایمیل"
            placeholder="ایمیل خود را وارد کنید"
            variant="underlined"
            isInvalid={!!errors.email?.message}
          />
          <p
            className={`${
              errors.email?.message?.length ? "opacity-100" : "opacity-0"
            } transition-opacity duration-250 ease-in-out -mt-3 mb-3 text-[13px] text-[#F31260] h-2`}
          >
            {errors.email?.message}
          </p>

          <Input
            {...register("password")}
            size="lg"
            isRequired
            startContent={<BsKey size={19} />}
            type={isVisible ? "text" : "Password"}
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
