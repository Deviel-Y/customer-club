"use client";

import RoleSelection from "@/app/components/RoleSelection";
import { Button, Card, Input } from "@nextui-org/react";
import { Key, useState } from "react";

const UserForm = () => {
  const [selectedRole, setSelectedRole] = useState<Key>();

  return (
    <form className="flex justify-center items-center">
      <Card className="flex flex-col p-5 w-4/5 gap-5">
        <div>
          <h2 className="text-[25px]">اطلاعات کاربر</h2>
        </div>

        <div className="grid grid-cols-4 grid-rows-4 gap-5 place-items-center">
          <Input
            isRequired
            size="lg"
            type="email"
            className="col-span-3"
            label="آدرس ایمیل"
          />

          <RoleSelection selectedRole={(value) => setSelectedRole(value!)} />

          <Input
            isRequired
            size="lg"
            type="password"
            className="col-span-2"
            label="رمز عبور"
          />

          <Input
            isRequired
            size="lg"
            type="password"
            className="col-span-2"
            label="تکرار رمز عبور"
          />

          <Input
            isDisabled={selectedRole === "ADMIN"}
            isRequired
            size="lg"
            className="col-span-2"
            label="نام سازمان"
          />

          <Input
            isDisabled={selectedRole === "ADMIN"}
            size="lg"
            className="col-span-2"
            label="نام شعبه"
          />

          <Input
            isDisabled={selectedRole === "ADMIN"}
            size="lg"
            className="col-span-2"
            label="مسئول انفوماتیک"
          />

          <Input
            isDisabled={selectedRole === "ADMIN"}
            size="lg"
            className="col-span-2"
            label="آدرس"
          />
        </div>

        <div className="flex flex-row gap-5 mt-5">
          <Button size="lg" color="primary" variant="shadow">
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
