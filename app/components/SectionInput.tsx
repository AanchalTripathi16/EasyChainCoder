import { Dispatch, SetStateAction, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import TokenModel from "./TokenModel";

const SectionInput = ({
  title,
  selectedLiquidity,
  placeholder,
  inputRef,
  setInputValue,
  inputValue,
}: {
  title: "To" | "From" | null;
  selectedLiquidity: any;
  placeholder: string;
  inputRef: string;
  setInputValue: Dispatch<SetStateAction<Number>>;
  inputValue: any;
}) => {
  const [isModelOpen, setIsModelOpen] = useState<boolean>(false);

  return (
    <>
      {isModelOpen && <TokenModel setIsOpen={setIsModelOpen} title={title!} />}
      <div className="relative w-full  flex flex-col space-y-2">
        <div className="relative flex flex-row w-full h-[70px] border-[1px] border-[#CDCECF] rounded-md p-4">
          <div className="relative w-[50%] h-full flex items-center justify-center">
            <input
              key={inputRef}
              value={inputValue || 0}
              className="bg-transparent text-white w-full text-xsm !outline-none placeholder:text-[#626262] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder={placeholder}
              type="number"
              onChange={(e) => setInputValue(Number(e.target?.value))}
            />
          </div>
          <div className="flex flex-col h-full overflow-y-visible  space-y-1 relative w-[50%] ">
            <button
              className="h-full  border-[1px] border-[#CDCECF] rounded-md p-2 flex flex-row space-x-2 items-center justify-start hover:bg-white/20"
              onClick={() => setIsModelOpen(!isModelOpen)}
            >
              <div
                className={`rounded-full size-6 flex items-center justify-center ${
                  !selectedLiquidity && "bg-prime-border-200"
                }`}
              >
                {selectedLiquidity && (
                  <img
                    src={selectedLiquidity.logo}
                    className="relative size-6 object-contain"
                  />
                )}
              </div>
              <p className="relative text-sm text-prime-token-200 font-semibold text-nowrap text-ellipsis  overflow-x-hidden max-w-[80%]">
                {!selectedLiquidity ? "Select Token" : selectedLiquidity.name}
              </p>
              <RiArrowDropDownLine className="text-prime-token-200 size-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionInput;
