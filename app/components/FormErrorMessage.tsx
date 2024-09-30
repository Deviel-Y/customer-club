interface Props {
  errorMessage: string;
}

const FormErrorMessage = ({ errorMessage }: Props) => {
  return (
    <p
      className={`${
        errorMessage.length ? "opacity-100" : "opacity-0"
      } transition-opacity duration-250 ease-in-out mt-1 mb-3 text-[13px] text-[#F31260] h-2`}
    >
      {errorMessage}
    </p>
  );
};

export default FormErrorMessage;
