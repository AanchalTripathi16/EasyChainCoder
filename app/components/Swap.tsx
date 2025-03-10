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
    <div className="relative w-full h-[80%] flex flex-col justify-center items-center p-4">
      {/* Background with gradient effect */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-[#297373]/30 to-[#1a1a1a] opacity-80 z-0"></div> */}

      {/* Animated background particles */}
      {/* <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] bg-repeat opacity-10 z-0"></div> */}

      {/* DEX */}
      <div className="relative z-10 flex flex-col w-[90%] max-w-md h-auto bg-[#1a1a1a]/80 backdrop-blur-md text-white border border-purple-500/30 rounded-xl shadow-lg shadow-pink-500/10">
        <div className="relative flex w-full h-[60px] items-center justify-center text-center text-white text-xl font-semibold border-b border-purple-500/20">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Swap Tokens
          </span>
        </div>
        <div className="relative flex w-full flex-col items-center justify-start space-y-8 px-6 py-10">
          <SectionInput
            title="From"
            selectedLiquidity={selectedLiquidity}
            placeholder="Minimum Amount"
            inputRef="fromAmount"
            setInputValue={setFromAmount}
            inputValue={fromAmount}
          />

          {/* Arrow indicator */}
          <div className="flex justify-center items-center w-full">
            <div className="p-2 rounded-full bg-[#1a1a1a] border border-purple-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-pink-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>

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
            className="text-white text-base font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600/60 disabled:to-gray-600/60 text-center rounded-lg w-full h-[50px] transition-all duration-300 shadow-md"
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
