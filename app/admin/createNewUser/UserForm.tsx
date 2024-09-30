"use client";

import RoleSelection from "@/app/components/RoleSelection";
import {
  createUserSchame,
  CreateUserSchameType,
} from "@/app/libs/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input } from "@nextui-org/react";
import { Key, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const UserForm = () => {
  const [selectedRole, setSelectedRole] = useState<Key>();
  const { register, handleSubmit, control, setValue, getValues } =
    useForm<CreateUserSchameType>({
      resolver: zodResolver(createUserSchame),
    });

  const clearDisabledFields = () => {
    if (selectedRole === "ADMIN") {
      setValue("companyName", undefined, { shouldValidate: true });
      setValue("companyBranch", undefined, { shouldValidate: true });
      setValue("itManager", undefined, { shouldValidate: true });
      setValue("address", undefined, { shouldValidate: true });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(() => {
        clearDisabledFields();
        const data = getValues();

        console.log(data);
        // use axios
      })}
      className="flex justify-center items-center"
    >
      <Card className="flex flex-col p-5 w-3/5 gap-8">
        <div>
          <h2 className="text-[25px]">اطلاعات کاربر</h2>
        </div>

        <div className="grid grid-cols-4 grid-rows-4 gap-7 place-items-center">
          <Input
            {...register("email")}
            isRequired
            size="lg"
            type="email"
            className="col-span-3"
            label="آدرس ایمیل"
          />

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

          <Input
            {...register("password")}
            isRequired
            size="lg"
            type="password"
            className="col-span-2"
            label="رمز عبور"
          />

          <Input
            {...register("confirmPassword")}
            isRequired
            size="lg"
            type="password"
            className="col-span-2"
            label="تکرار رمز عبور"
          />

          <Input
            {...register("companyName")}
            isDisabled={selectedRole === "ADMIN"}
            size="lg"
            className="col-span-2"
            label="نام سازمان"
          />

          <Input
            {...register("companyBranch")}
            isDisabled={selectedRole === "ADMIN"}
            size="lg"
            className="col-span-2"
            label="نام شعبه"
          />

          <Input
            {...register("itManager")}
            isDisabled={selectedRole === "ADMIN"}
            size="lg"
            className="col-span-2"
            label="مسئول انفوماتیک"
          />

          <Input
            {...register("address")}
            isDisabled={selectedRole === "ADMIN"}
            size="lg"
            className="col-span-2"
            label="آدرس"
          />
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
    </form>
  );
};

export default UserForm;
