import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div className="grid grid-cols-2 max-lg:p-5 max-md:grid-cols-1 place-content-stretch place-items-center h-screen">
      <div className="p-24 max-md:hidden">
        <p className="font-bold text-[29px] -mb-5 max-lg:text-[24px] max-lg:-mb-3">
          Smiles and content find their nest at
        </p>
        <h1 className="font-extrabold text-[70px] max-lg:text-[50px]">
          CONTENT NEST
        </h1>
        <article className="font-semibold text-[16px] mt-3 text-justify">
          Content Nest is where smiles and creativity come together. It&apos;s a
          welcoming community where your content finds its perfect home, and
          every post spreads joy. Nest your content here, and let it thrive in a
          space that celebrates positivity and connection.
        </article>
      </div>

      <div className="mt-10 w-full">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
