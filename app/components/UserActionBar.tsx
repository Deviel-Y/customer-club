import { Input } from "@nextui-org/react";

const UserActionBar = () => {
  return (
    <div className="grid grid-cols-2 gap-5 w-1/2">
      <Input
        label="شماره فاکتور"
        type="search"
        size="lg"
        variant="underlined"
      />
      <Input label="موضوع" type="search" size="lg" variant="underlined" />
    </div>
  );
};

export default UserActionBar;
