"use client";

import { Button, Card, Input } from "@nextui-org/react";
import { User } from "@prisma/client";

interface Props {
  user: User;
}

const EditUserInfoForm = ({ user }: Props) => {
  return (
    <form>
      <Card className="flex flex-col gap-5 p-5">
        <h2 className="text-[25px] mb-5">اطلاعات کاربر</h2>

        <div className="grid grid-cols-3 grid-rows-2 gap-5 place-content-center place-items-center">
          <Input defaultValue={user.companyName!} size="lg" label="نام شعبه" />

          <Input
            defaultValue={user.itManager!}
            size="lg"
            label="مسئول انفوماتیک"
          />

          <Button color="secondary" size="lg">
            ویرایش عکس پروفایل
          </Button>

          <Input size="lg" label="گذرواژه فعلی" />

          <Input size="lg" label="گذرواژه جدید" />

          <Input size="lg" label="تکرار گذرواژه جدید" />
        </div>

        <div className="flex flex-row mt-5 gap-5">
          <Button size="lg" color="primary" variant="shadow">
            ویرایش اطلاعات
          </Button>

          <Button size="lg" color="danger">
            انصراف
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default EditUserInfoForm;
