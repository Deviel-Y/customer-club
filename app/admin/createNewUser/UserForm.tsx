"use client";

import RoleSelection from "@/app/admin/components/RoleSelection";
import FormErrorMessage from "@/app/components/FormErrorMessage";
import {
  FullUserSchameType,
  fullUserSchame,
} from "@/app/libs/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input } from "@nextui-org/react";
import { Role, User } from "@prisma/client";
import axios, { AxiosError } from "axios";
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
  userRole: Role;
}

const UserForm = ({ user, userRole }: Props) => {
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

  const onSubmit = handleSubmit(({ phoneNumber, companyName, ...data }) => {
    setisLoading(true);

    user
      ? axios
          .patch(`/api/userAuth/editUser/${user.id}`, {
            phoneNumber,
            companyName: companyName?.trim(),
            ...data,
          })
          .then(() => {
            toast.success("اطلاعات کاربر ویرایش شد");
            router.push("/admin/userList");
            router.refresh();
          })
          .catch((error: AxiosError) =>
            toast.error(error.response?.data as string)
          )
          .finally(() => setisLoading(false))
      : axios
          .post("/api/userAuth", {
            phoneNumber,
            companyName: companyName?.trim(),
            ...data,
          })
          .then(() => {
            toast.success("کاربر جدید تعریف شد");
            router.push("/admin/userList");
            router.refresh();
          })
          .catch((error: AxiosError) =>
            toast.error(error.response?.data as string)
          )
          .finally(() => setisLoading(false));
  });

  return (
    <form onSubmit={onSubmit} className="flex justify-center items-center">
      <Card className="flex flex-col p-5 max-sm:p-2 gap-3 w-4/5">
        <div>
          <h2 className="text-[25px] max-sm:text-[18px]">اطلاعات کاربر</h2>
        </div>

        <div
          className={`grid grid-cols-4 max-sm:grid-cols-1 grid-rows-4 ${
            userRole === "SUPER_ADMIN"
              ? "max-sm:grid-rows-8"
              : "max-sm:grid-rows-7"
          } gap-3 max-sm:gap-1 place-items-center`}
        >
          <div
            className={`${
              userRole === "SUPER_ADMIN"
                ? "col-span-2 max-md:col-span-2"
                : "col-span-4 max-md:col-span-4 max-sm:col-span-1"
            } w-full`}
          >
            <Input
              {...register("phoneNumber")}
              defaultValue={user?.phoneNumber || ""}
              isRequired
              type="number"
              label="شماره همراه"
            />

            <FormErrorMessage
              errorMessage={errors.phoneNumber?.message || ""}
            />
          </div>

          {userRole === "SUPER_ADMIN" && (
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
              isRequired={selectedRole === "CUSTOMER" || userRole === "ADMIN"}
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
              isRequired={selectedRole === "CUSTOMER" || userRole === "ADMIN"}
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
              isRequired={selectedRole === "CUSTOMER" || userRole === "ADMIN"}
              size="md"
              label="مسئول انفوماتیک"
            />

            <FormErrorMessage errorMessage={errors.itManager?.message || ""} />
          </div>
          <div
            className={`col-span-3 ${
              userRole === "SUPER_ADMIN"
                ? "max-md:col-span-4"
                : "max-md:col-span-2"
            } max-sm:col-span-1 w-full`}
          >
            <Input
              defaultValue={user?.address || ""}
              {...register("address")}
              isDisabled={selectedRole === "ADMIN"}
              isRequired={selectedRole === "CUSTOMER" || userRole === "ADMIN"}
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
