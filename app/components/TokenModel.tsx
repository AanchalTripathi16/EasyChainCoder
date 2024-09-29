import { Networks, TokenList } from "@/config";
import { useLoginContext } from "@/contexts/LoginContext";
import { useSwapContext } from "@/contexts/Swapcontext";
import React, { Dispatch, SetStateAction, useState } from "react";

const TokenModel = ({
  setIsOpen,
  title,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}) => {
  const [tokenList, setTokenList] = useState<any[]>(TokenList);
  const {
    selectedLiquidity,
    setSelectedLiquidity,
    selectedToLiquidity,
    setSelectedToLiquidity,
    fromLiquidity,
    setFromLiquidity,
    toLiquidity,
    setToLiquidity,
    selectedNetwork,
    setSelectedNetwork,
    route,
  } = useLoginContext();
  const { setSelectedToNetwork } = useSwapContext();

  return (
    <div
      className={`flex flex-col space-y-8  absolute ${
        route == "liquidity" ? "top-[20px] h-[600px]" : "top-[-50px] h-[570px]"
      } w-[420px] h-[600px] right-0.5 bg-[#297373] border-[1px] p-4 border-[#39393A] rounded-md z-20`}
    >
      <div className="relative flex w-full justify-center items-center text-white text-lg font normal">
        Select Token
      </div>
      <div className="relative flex flex-row gap-2 w-full  ">
        {Networks.map((item) => (
          <button
            disabled={
              (title == "To" && route != "bridge") ||
              (title == "To" &&
                selectedNetwork?.name == item.name &&
                route == "bridge")
            }
            className={`w-[100px] h-[90px] flex justify-center disabled:opacity-30 items-center text-white border border-[#39393A] rounded-md font-sm font-normal ${
              selectedNetwork?.name == item.name &&
              "border-white bg-[#39393A]/20"
            } `}
            onClick={() => {
              if (route != "bridge") {
                setSelectedNetwork(item);
              } else {
                if (title == "To") {
                  setSelectedToNetwork(item);
                } else {
                  setSelectedNetwork(item);
                  setSelectedToNetwork(null);
                }
              }
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      {selectedNetwork != null && (
        <div className="flex  w-full max-h-[400px] overflow-y-auto  ">
          <div className=" flex flex-col w-full h-auto space-y-2  ">
            {tokenList.map((item) => (
              <button
                className="flex flex-row space-x-2  text-white font-normal text-base hover:bg-[#39393A]/20  w-full min-h-[40px] rounded-md items-center px-3 justify-start border border-[#39393A]"
                onClick={() => {
                  if (title != "To") {
                    setSelectedLiquidity(item);
                  } else {
                    setSelectedToLiquidity(item);
                  }
                  setIsOpen(false);
                }}
              >
                <img src={item.logo} className="size-5" />
                <p> {item.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default TokenModel;
