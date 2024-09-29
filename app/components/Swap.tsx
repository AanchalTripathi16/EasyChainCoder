import React from "react";
import SectionInput from "./SectionInput";
import { useLoginContext } from "@/contexts/LoginContext";
import { useSwapContext } from "@/contexts/Swapcontext";

const Swap = () => {
  const {
    selectedPool,
    setSelectedPool,
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    Twoby1,
    setTwoby1,
    buttonText,
    continueTransaction,
    selectedLiquidity,
    setSelectedLiquidity,
    selectedToLiquidity,
    setSelectedToLiquidity,
    fromLiquidity,
    setFromLiquidity,
    toLiquidity,
    setToLiquidity,
  } = useLoginContext();
  const { SwapLiquidity } = useSwapContext();

  const isDisabled =
    buttonText == "Select Token" || buttonText == "Enter Amount";

  return (
    <div className="relative w-full h-[80%] flex flex-row  justify-center items-center space-x-2 p-4 ">
      {/* DEX */}
      <div className="relative flex flex-col w-[30%] h-full bg-[#297373]/20 text-white border border-[#39393A] rounded-md">
        <div className="relative flex  w-full h-[10%] items-center justify-center text-center text-white text-xl font-semibold border-b-2 border-[#39393A]">
          Swap
        </div>
        <div className="relative flex w-full h-[90%] flex-col items-center justify-start space-y-8 px-6 py-10">
          <SectionInput
            title="From"
            selectedLiquidity={selectedLiquidity}
            placeholder="Minimum Amount"
            inputRef="fromAmount"
            setInputValue={setFromAmount}
            inputValue={fromAmount}
          />
          <SectionInput
            title="To"
            selectedLiquidity={selectedToLiquidity}
            placeholder="Minimum Amount"
            inputRef="toAmount"
            setInputValue={setToAmount}
            inputValue={toAmount}
          />

          <button
            disabled={isDisabled}
            className="text-white text-base font-nomal bg-[#297373] disabled:bg-[#39393A]/60 text-center rounded-md w-full h-[40px]"
            onClick={() => {
              SwapLiquidity();
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
