import React from "react";
import SectionInput from "./SectionInput";
import { useLoginContext } from "@/contexts/LoginContext";
import { ethers } from "ethers";
import BridgeAbi from "@/consts/Abis/bridge.json";
import { useSwapContext } from "@/contexts/Swapcontext";

const Bridge = () => {
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
    networkData,
    address,
    selectedNetwork,
  } = useLoginContext();
  const { selectedToNetwork } = useSwapContext();

  const isDisabled =
    buttonText == "Select Token" || buttonText == "Enter Amount";

  const bridgechainMAp: any = {
    bnb: "0x27E11cd7831963101452dbd0f41c1D011F2Fa122",
    arb: "0x0A063b3AD7044a122c4C0b31A5BcB07e9D8498be",
    neo: "0xE844478Acb6b7714ac1ffb08aFC3E9D13a1E8fB7",
    base: "0x27E11cd7831963101452dbd0f41c1D011F2Fa122",
    eth: "0x41E65e9E6b200eb6cf9af08Fe0A876e2B32E5249",
  };

  const lockCall = async () => {
    try {
      const web3Provider = networkData?.provider as ethers.BrowserProvider;
      const signer = await web3Provider.getSigner(address!);
      let bridgeData = null;

      const bridgeContract = await new ethers.Contract(
        bridgechainMAp[selectedNetwork?.code],
        BridgeAbi,
        signer
      );
      const lockArgs = [
        selectedLiquidity?.address,
        Number(fromAmount),
        selectedToNetwork?.chainId,
        selectedToLiquidity?.address,
      ];
      bridgeData = await bridgeContract.lock(...lockArgs);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="relative w-full h-[80%] flex flex-row  justify-center items-center space-x-2 p-4 ">
      {/* DEX */}
      <div className="relative flex flex-col w-[30%] h-full bg-[#297373]/20 text-white border border-[#39393A] rounded-md">
        <div className="relative flex  w-full h-[10%] items-center justify-center text-center text-white text-xl font-semibold border-b-2 border-[#39393A]">
          Bridge
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
            onClick={lockCall}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bridge;
