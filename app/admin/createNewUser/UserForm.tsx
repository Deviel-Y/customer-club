"use client";

import RoleSelection from "@/app/admin/components/RoleSelection";
import FormErrorMessage from "@/app/components/FormErrorMessage";
import {
  FullUserSchameType,
  fullUserSchame,
} from "@/app/libs/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input } from "@nextui-org/react";
import { User } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Key, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

type PasswordVisibility = {
  password: boolean;
  confirmPassword: boolean;
};

interface Props {
  user?: User;
  session: Session;
}

const UserForm = ({ user, session }: Props) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState<boolean>(false);
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
    formState: { errors },
  } = useForm<FullUserSchameType>({
    resolver: zodResolver(fullUserSchame),
  });

  const onSubmit = handleSubmit(({ email, companyName, ...data }) => {
    setisLoading(true);

    const promise = user
      ? axios
          .patch(`/api/userAuth/editUser/${user.id}`, {
            email: email?.trim(),
            companyName: companyName?.trim(),
            ...data,
          })
          .then(() => {
            router.push("/admin/userList");
            router.refresh();
          })
          .finally(() => setisLoading(false))
      : axios
          .post("/api/userAuth", {
            email: email?.trim(),
            companyName: companyName?.trim(),
            ...data,
          })
          .then(() => {
            router.push("/admin/userList");
            router.refresh();
          })
          .finally(() => setisLoading(false));

    toast.promise(promise, {
      error: (error: AxiosError) => error.response?.data as string,
      loading: user
        ? "در حال ویرایش اطلاعات کاربر "
        : "در حال تعریف کاربر جدید",
      success: user ? "اطلاعات کاربر ویرایش شد" : "کاربر جدید تعریف شد",
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex justify-center items-center">
      <Card className="flex flex-col p-5 max-sm:p-2 gap-3 w-4/5">
        <div>
          <h2 className="text-[25px] max-sm:text-[18px]">اطلاعات کاربر</h2>
        </div>

        <div
          className={`grid grid-cols-4 max-sm:grid-cols-1 grid-rows-4 ${
            session?.user?.role === "SUPER_ADMIN"
              ? "max-sm:grid-rows-8"
              : "max-sm:grid-rows-7"
          } gap-3 max-sm:gap-1 place-items-center`}
        >
          <div
            className={`${
              session?.user?.role === "SUPER_ADMIN"
                ? "col-span-2 max-md:col-span-2"
                : "col-span-4 max-md:col-span-4 max-sm:col-span-1"
            } w-full`}
          >
            <Input
              {...register("email")}
              defaultValue={user?.email || ""}
              isRequired
              type="email"
              label="آدرس ایمیل"
            />

            <FormErrorMessage errorMessage={errors.email?.message || ""} />
          </div>

          {session?.user?.role === "SUPER_ADMIN" && (
            <>
              <div className="col-span-1 max-md:col-span-2 w-full">
                <Input
                  {...register("adminName")}
                  isDisabled={selectedRole === "CUSTOMER"}
                  defaultValue={user?.adminName || ""}
                  isRequired
                  label="نام ادمین"
                />
                <FormErrorMessage
                  errorMessage={errors.adminName?.message || ""}
                />
              </div>

              <div className="max-md:col-span-2 w-full">
                <Controller
                  name="role"
                  control={control}
                  defaultValue={user?.role ? user?.role : undefined}
                  render={({ field: { onChange } }) => (
                    <RoleSelection
                      userRole={user?.role!}
                      selectedRole={(value) => (
                        setSelectedRole(value!), onChange(value)
                      )}
                    />
                  )}
                />

                <FormErrorMessage errorMessage={errors.role?.message || ""} />
              </div>
            </>
          )}

          <div className="col-span-2 w-full">
            <div className="flex flex-row justify-center items-center">
              <Input
                endContent={
                  <Button
                    size="sm"
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
                {...register("newPassword")}
                isRequired
                size="md"
                type={isPasswordsVisible.password ? "text" : "password"}
                label="رمز عبور"
              />
            </div>

            <FormErrorMessage
              errorMessage={errors.newPassword?.message || ""}
            />
          </div>
          <div className="col-span-2 w-full">
            <Input
              {...register("confirmPassword")}
              isRequired
              size="md"
              type="password"
              label="تکرار رمز عبور"
            />

            <FormErrorMessage
              errorMessage={errors.confirmPassword?.message || ""}
            />
          </div>
          <div className="col-span-2 w-full">
            <Input
              defaultValue={user?.companyName || ""}
              {...register("companyName")}
              isDisabled={selectedRole === "ADMIN"}
              isRequired={
                selectedRole === "CUSTOMER" || session?.user?.role === "ADMIN"
              }
              size="md"
              label="نام سازمان"
            />

            <FormErrorMessage
              errorMessage={errors.companyName?.message || ""}
            />
          </div>
          <div className="col-span-2 w-full">
            <Input
              defaultValue={user?.companyBranch || ""}
              {...register("companyBranch")}
              isDisabled={selectedRole === "ADMIN"}
              isRequired={
                selectedRole === "CUSTOMER" || session?.user?.role === "ADMIN"
              }
              size="md"
              label="نام شعبه"
            />

            <FormErrorMessage
              errorMessage={errors.companyBranch?.message || ""}
            />
          </div>
          <div className="col-span-1 max-md:col-span-2 w-full">
            <Input
              defaultValue={user?.itManager || ""}
              {...register("itManager")}
              isDisabled={selectedRole === "ADMIN"}
              isRequired={
                selectedRole === "CUSTOMER" || session?.user?.role === "ADMIN"
              }
              size="md"
              label="مسئول انفوماتیک"
            />

            <FormErrorMessage errorMessage={errors.itManager?.message || ""} />
          </div>
          <div
            className={`col-span-3 ${
              session?.user.role === "SUPER_ADMIN"
                ? "max-md:col-span-4"
                : "max-md:col-span-2"
            } max-sm:col-span-1 w-full`}
          >
            <Input
              defaultValue={user?.address || ""}
              {...register("address")}
              isDisabled={selectedRole === "ADMIN"}
              isRequired={
                selectedRole === "CUSTOMER" || session?.user?.role === "ADMIN"
              }
              size="md"
              label="آدرس"
            />

            <FormErrorMessage errorMessage={errors.address?.message || ""} />
          </div>
        </div>

        <div className="flex flex-row max-sm:justify-center max-sm:mt-5 gap-5">
          <Button
            isLoading={isLoading}
            type="submit"
            size="md"
            color="primary"
            variant="shadow"
          >
            {user ? "ویرایش " : "ایجاد"}
          </Button>

          <Button
            isDisabled={isLoading}
            onPress={() => router.push("/admin/userList")}
            size="md"
            color="danger"
            variant="light"
          >
            انصراف
          </Button>
        </div>
      </Card>
      <Toaster />
    </form>
  );
};

export default UserForm;
