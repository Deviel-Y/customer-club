"use client";

import FormErrorMessage from "@/app/components/FormErrorMessage";
import RoleSelection from "@/app/components/RoleSelection";
import {
  createUserSchame,
  CreateUserSchameType,
} from "@/app/libs/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Key, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

type PasswordVisibility = {
  password: boolean;
  confirmPassword: boolean;
};

const UserForm = () => {
  const [selectedRole, setSelectedRole] = useState<Key>();
  const [isPasswordsVisible, setIsPasswordsVisible] =
    useState<PasswordVisibility>({
      password: false,
      confirmPassword: false,
    });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, disabled },
  } = useForm<CreateUserSchameType>({
    resolver: zodResolver(createUserSchame),
  });
  const router = useRouter();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const promise = axios.post("/api/userAuth", data).then(() => {
          router.push("/admin/userList");
          router.refresh();
        });

        toast.promise(promise, {
          error: "خطایی در تعریف کاربر رخ داده است",
          loading: "در حال تعریف کابر جدید",
          success: "کاربر جدید تعریف شد",
        });
      })}
      className="flex justify-center items-center"
    >
      <Card className="flex flex-col p-5 gap-5 w-4/5">
        <div>
          <h2 className="text-[25px]">اطلاعات کاربر</h2>
        </div>

        <div className="grid grid-cols-4 grid-rows-4 gap-3 place-items-center">
          <div className="col-span-3 w-full">
            <Input
              {...register("email")}
              isRequired
              size="lg"
              type="email"
              label="آدرس ایمیل"
            />

            <FormErrorMessage errorMessage={errors.email?.message || ""} />
          </div>

          <div>
            <Controller
              name="role"
              control={control}
              render={({ field: { onChange } }) => (
                <RoleSelection
                  selectedRole={(value) => (
                    setSelectedRole(value!), onChange(value)
                  )}
                />
              )}
            />

            <FormErrorMessage errorMessage={errors.role?.message || ""} />
          </div>

          <div className="col-span-2 w-full">
            <Input
              endContent={
                <Button
                  onPress={() =>
                    setIsPasswordsVisible({
                      ...isPasswordsVisible,
                      password: !isPasswordsVisible.password,
                    })
                  }
                  isIconOnly
                >
                  {isPasswordsVisible.password ? (
                    <AiFillEye size={20} fill="#585858" />
                  ) : (
                    <AiFillEyeInvisible size={20} fill="#585858" />
                  )}
                </Button>
              }
              {...register("password")}
              isRequired
              size="lg"
              type={isPasswordsVisible.password ? "text" : "password"}
              label="رمز عبور"
            />

            <FormErrorMessage errorMessage={errors.password?.message || ""} />
          </div>

          <div className="col-span-2 w-full">
            <Input
              {...register("confirmPassword")}
              isRequired
              size="lg"
              type="password"
              label="تکرار رمز عبور"
            />

            <FormErrorMessage
              errorMessage={errors.confirmPassword?.message || ""}
            />
          </div>

          <div className="col-span-2 w-full">
            <Input
              {...register("companyName")}
              isDisabled={selectedRole === "ADMIN"}
              size="lg"
              label="نام سازمان"
            />

            <FormErrorMessage
              errorMessage={errors.companyName?.message || ""}
            />
          </div>

          <div className="col-span-2 w-full">
            <Input
              {...register("companyBranch")}
              isDisabled={selectedRole === "ADMIN"}
              size="lg"
              label="نام شعبه"
            />

            <FormErrorMessage
              errorMessage={errors.companyBranch?.message || ""}
            />
          </div>

          <div className="col-span-1 w-full">
            <Input
              {...register("itManager")}
              isDisabled={selectedRole === "ADMIN"}
              size="lg"
              label="مسئول انفوماتیک"
            />

            <FormErrorMessage errorMessage={errors.itManager?.message || ""} />
          </div>

          <div className="col-span-3 w-full">
            <Input
              {...register("address", { required: !disabled })}
              isDisabled={selectedRole === "ADMIN"}
              size="lg"
              label="آدرس"
            />

            <FormErrorMessage errorMessage={errors.address?.message || ""} />
          </div>
        </div>

        <div className="flex flex-row gap-5 mt-5">
          <Button type="submit" size="lg" color="primary" variant="shadow">
            ایجاد
          </Button>

          <Button size="lg" color="danger" variant="light">
            انصراف
          </Button>
        </div>
      </Card>
      <Toaster />
    </form>
  );
};

export default UserForm;
