"use client";

import FormErrorMessage from "@/app/components/FormErrorMessage";
import {
  adminSide_userSchame,
  AdminSide_userSchameType,
} from "@/app/libs/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input } from "@nextui-org/react";
import { User } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  user: User;
}

const EditAdminProfileForm = ({ user }: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSide_userSchameType>({
    resolver: zodResolver(adminSide_userSchame),
  });
  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (
          data.currentPassword &&
          (!data.newPassword || !data.confirmPassword)
        )
          return toast.error("برای تغییر گذرواژه، گذرواژه جدید را وارد کنید");

        if (!data.adminName)
          return toast.error("وارد کردن نام ادمین الزامی است");

        const promise = axios
          .patch(`/api/userAuth/editUser/${user.id}`, {
            ...data,
            role: user?.role,
            companyName: user?.companyName,
            address: user?.address,
            phoneNumber: user?.phoneNumber,
          })
          .then(() => {
            router.push("/");
            router.refresh();
          });

        toast.promise(promise, {
          success: "اطلاعات با موفقیت ویرایش شد.",
          loading: "در حال ویرایش اطلاعات...",
          error: (error: AxiosError) => error?.response?.data as string,
        });
      })}
    >
      <Card className="flex flex-col gap-5 max-sm:gap-1 p-5 max-sm:p-2">
        <h2 className="text-[25px] max-sm:text-[18px] max-sm:mb-5">
          اطلاعات کاربر
        </h2>

        <div className="grid grid-cols-1 grid-rows-2 max-sm:grid-rows-1 place-content-center place-items-center">
          <div className="w-full">
            <Input
              defaultValue={user?.adminName!}
              {...register("adminName")}
              size="lg"
              label="نام ادمین"
            />
            <FormErrorMessage errorMessage={errors.adminName?.message || ""} />
          </div>

          <div className="grid grid-cols-3 max-sm:grid-cols-1 grid-rows-1 max-sm:grid-rows-3 gap-5 max-sm:gap-0 w-full">
            <div className="w-full">
              <Input
                {...register("currentPassword")}
                type="password"
                size="lg"
                label="گذرواژه فعلی"
              />
              <FormErrorMessage
                errorMessage={errors.currentPassword?.message || ""}
              />
            </div>

            <div className="w-full">
              <Input
                {...register("newPassword")}
                type="password"
                size="lg"
                label="گذرواژه جدید"
              />
              <FormErrorMessage
                errorMessage={errors.newPassword?.message || ""}
              />
            </div>

            <div className="w-full">
              <Input
                {...register("confirmPassword")}
                type="password"
                size="lg"
                label="تکرار گذرواژه جدید"
              />
              <FormErrorMessage
                errorMessage={errors.confirmPassword?.message || ""}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center max-sm:justify-center max-sm:flex-col-reverse gap-y-5">
          <div className="flex flex-row gap-x-5">
            <Button type="submit" size="lg" color="primary" variant="shadow">
              ویرایش اطلاعات
            </Button>

            <Button
              onPress={() => router.push("/")}
              size="lg"
              variant="light"
              color="danger"
            >
              انصراف
            </Button>
          </div>

          <div className="max-sm:w-full max-sm:justify-self-center">
            <Button color="secondary" className="max-sm:w-full" size="lg">
              ویرایش عکس پروفایل
            </Button>
          </div>
        </div>
      </Card>
      <Toaster />
    </form>
  );
};

export default EditAdminProfileForm;
