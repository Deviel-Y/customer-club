import getSession from "@/app/libs/getSession";
import { authorizeAdmin } from "@/app/utils/authorizeRole";
import UserForm from "./UserForm";

const CreateNewUserPage = async () => {
  const session = await getSession();
  authorizeAdmin(session!);

  return (
    <div className="py-5 px-2">
      <UserForm />
    </div>
  );
};

export default CreateNewUserPage;
