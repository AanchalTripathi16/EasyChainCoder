import React, { useEffect, useState } from "react";
import SectionInput from "./SectionInput";
import { useLoginContext } from "@/contexts/LoginContext";
import { MdInfo } from "react-icons/md";
import { getPoolLists } from "@/services/userService";
import Pagination from "./Pagination";
import useEffectAsync from "../utils/useEffectAsync";
import { Networks, TokenList } from "@/config";

const Liquidity = () => {
  const {
    address,
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
    selectedNetwork,
    networkData,
    switchNetwork,
    poolList,
    setPoolList,
    resetValues,
  } = useLoginContext();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const length = 4;
  const poolListMyShare =
    poolList?.filter((item: any) => item.haveShare != 0) || [];

  const isDisabled =
    buttonText == "Select Token" ||
    buttonText == "Enter Amount" ||
    buttonText == "Enter Pool Ratio";
  const [switchData, setSwitchData] = useState<any>(null);
  const [isNotSwitch, setIsNotSwitch] = useState<boolean>(true);
  useEffect(() => {
    if (selectedNetwork != null) {
      setSwitchData(selectedNetwork);
      setIsNotSwitch(
        networkData?.chainId != selectedNetwork?.chainId ? false : true
      ); //For Now Being
    }
  }, [selectedNetwork, networkData]);

  useEffectAsync(async () => {
    const response: any = await getPoolLists(currentPageNo, length);
    setPoolList(response?.data?.pools);
  }, []);

  const {
    selectedLiquidity,
    setSelectedLiquidity,
    selectedToLiquidity,
    setSelectedToLiquidity,
    fromLiquidity,
    setFromLiquidity,
    toLiquidity,
    setToLiquidity,
    isCreatePool,
    setIsCreatePool,
    isAddLiquidity,
    setIsAddLiquidity,
    isRemoveLiquidity,
    setIsRemoveLiquidity,
    setSelectedNetwork,
  } = useLoginContext();

  useEffect(() => {
    if (fromAmount) {
      setToAmount((Number(fromAmount) * Number(Twoby1)).toFixed(4));
      console.log(Number(fromAmount) * Number(Twoby1));
    }
  }, [Twoby1, fromAmount]);

  return (
    <div className="relative w-full h-full flex flex-row space-x-2 p-4 ">
      {/* Overview */}
      <div className="relative flex flex-col w-[70%] h-full bg-[#297373]/10 text-white border border-[#39393A] rounded-md">
        <div className=" flex h-[60px] items-center justify-between px-5">
          <button className="text-white text-base font-nomal">Pool List</button>
          <button
            className="text-white text-base font-nomal bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-center rounded-md w-[200px] h-[40px]"
            onClick={() => {
              setIsAddLiquidity(false);
              setIsCreatePool(true);
              setIsRemoveLiquidity(false);
              resetValues();
            }}
          >
            Create Pool
          </button>
        </div>
        <div className="relative w-full h-full flex flex-col">
          <div className="relative w-full h-full grid sm:grid-cols-2 sm:grid-rows-2 grid-cols-1 gap-3 px-6 py-3 overflow-y-auto">
            {poolList?.length > 0 &&
              poolList
                .slice(length * (currentPageNo - 1), length * currentPageNo)
                .map((item, index) => (
                  <div
                    id={index.toString()}
                    className="relative w-full max-h-[17rem] rounded-md bg-[#1A1D21] flex justify-between flex-col space-y-2 p-3 border border-"
                  >
                    <div className="w-full flex flex-row items-center justify-between ">
                      <div className="flex flex-row items-center justify-center">
                        <div className="bg-black rounded-full size-6 flex items-center justify-center">
                          <img
                            src={
                              TokenList.filter(
                                (token: any) =>
                                  token.address == item.firstTokenAddress
                              )[0]?.logo
                            }
                            className="size-4"
                          />
                        </div>
                        <div className="bg-black rounded-full -translate-x-1 size-6 flex items-center justify-center">
                          <img
                            src={
                              TokenList.filter(
                                (token: any) =>
                                  token.address == item.secondTokenAddress
                              )[0]?.logo
                            }
                            className="size-4"
                          />
                        </div>
                        <p className="ml-2 text-sm font-semibold text-[#CDCECF]">
                          {
                            TokenList.filter(
                              (token: any) =>
                                token.address == item.firstTokenAddress
                            )[0]?.name
                          }
                          /
                          {
                            TokenList.filter(
                              (token: any) =>
                                token.address == item.secondTokenAddress
                            )[0]?.name
                          }
                        </p>
                      </div>
                      <button
                        className="flex items-center justify-center"
                        onClick={() => {}}
                      >
                        <MdInfo className="size-5" />
                      </button>
                    </div>
                    <div className="relative w-full flex flex-col space-y-1 items-start justify-start">
                      <p className="text-xs text-prime-gray-200 font-semibold">
                        Pool Reserve:
                      </p>
                      <p className="text-xs text-white font-semibold">
                        {" "}
                        {item?.firstTokenBalance}{" "}
                        {
                          TokenList.filter(
                            (token: any) =>
                              token.address == item.firstTokenAddress
                          )[0]?.name
                        }{" "}
                        | {item?.secondTokenBalance}{" "}
                        {
                          TokenList.filter(
                            (token: any) =>
                              token.address == item.secondTokenAddress
                          )[0]?.name
                        }
                      </p>
                    </div>
                    <div className="relative w-full flex flex-col space-y-1 items-start justify-start">
                      <p className="text-xs text-prime-gray-200 font-semibold">
                        Pool Share:
                      </p>
                      <p className="text-xs text-white font-semibold">
                        {item?.users?.filter(
                          (user: any) => user.address == address
                        ).length
                          ? (Number(
                              item?.users?.filter(
                                (user: any) => user.address == address
                              )[0].liquidity
                            ) /
                              Number(item.liquidityTokenBalance)) *
                            100
                          : "0"}
                        %{" "}
                        {/* Commenting out for time being ,as per now not have enough info to claculate this */}
                        {/* <span className="text-[#DB4437]">(-10.5% from yesterday)</span> */}
                      </p>
                    </div>
                    <div className="relative w-full flex flex-col space-y-1 items-start justify-start">
                      <p className="text-xs text-prime-gray-200 font-semibold">
                        Pool Tokens:
                      </p>
                      <p className="text-xs text-white font-semibold">
                        {" "}
                        {item?.firstTokenBalance}{" "}
                        {
                          TokenList.filter(
                            (token: any) =>
                              token.address == item.firstTokenAddress
                          )[0]?.name
                        }{" "}
                        | {item?.secondTokenBalance}{" "}
                        {
                          TokenList.filter(
                            (token: any) =>
                              token.address == item.secondTokenAddress
                          )[0]?.name
                        }
                      </p>
                    </div>
                    <div className="relative w-full flex flex-row space-x-2 mt-3">
                      <button
                        className="h-9 w-full rounded bg-white/5 text-white text-xs"
                        onClick={() => {
                          setSelectedPool(item);
                          setIsAddLiquidity(false);
                          setIsCreatePool(false);
                          setIsRemoveLiquidity(true);
                          setSelectedNetwork(
                            Networks.filter(
                              (network) => network.code == item.chainId
                            )[0]
                          );
                          setSelectedLiquidity(
                            TokenList.filter(
                              (token: any) =>
                                token.address == item.firstTokenAddress
                            )[0]
                          );
                          setSelectedToLiquidity(
                            TokenList.filter(
                              (token: any) =>
                                token.address == item.secondTokenAddress
                            )[0]
                          );
                          setTwoby1(
                            Number(
                              item.secondTokenBalance / item.firstTokenBalance
                            ).toFixed(2)
                          );
                        }}
                      >
                        Withdraw
                      </button>
                      <button
                        className="h-9 w-full bg-prime-blue-200 rounded text-white text-xs"
                        onClick={() => {
                          setSelectedPool(item);
                          setIsAddLiquidity(true);
                          setIsCreatePool(false);
                          setIsRemoveLiquidity(false);
                          setSelectedNetwork(
                            Networks.filter(
                              (network) => network.code == item.chainId
                            )[0]
                          );
                          setSelectedLiquidity(
                            TokenList.filter(
                              (token: any) =>
                                token.address == item.firstTokenAddress
                            )[0]
                          );
                          setSelectedToLiquidity(
                            TokenList.filter(
                              (token: any) =>
                                token.address == item.secondTokenAddress
                            )[0]
                          );
                          setTwoby1(
                            Number(
                              item.secondTokenBalance / item.firstTokenBalance
                            ).toFixed(2)
                          );
                        }}
                      >
                        Add Liquidity
                      </button>
                    </div>
                  </div>
                ))}
          </div>
          <div className=" bottom-0 py-2 w-full border-t-[2px] border-prime-background-200 flex items-center justify-center text-xsm">
            <Pagination
              setCurrentPageNo={setCurrentPageNo}
              currentPageNo={currentPageNo}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
      {/* DEX */}
      <div className="relative flex flex-col w-[30%] h-full bg-[#297373]/20 text-white border border-[#39393A] rounded-md">
        <div className="relative flex  w-full h-[10%] items-center justify-center text-center text-white text-xl font-semibold border-b-2 border-[#39393A]">
          {isCreatePool
            ? "Create Pool"
            : isAddLiquidity
            ? "Add Liquidity"
            : "Withdraw"}
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
          <div className="relative w-full flex flex-col space-y-3">
            <p>Price & Pool Share</p>
            <div className="relative flex flex-col space-y-4 w-full h-[120px] border-[1px] border-[#CDCECF] rounded-md px-6 py-4">
              {/* As Per Token 1 and Token 2 */}
              <div className="relative w-full flex flex-row space-x-2">
                <div className="relative w-[50%] flex flex-col space-y-1 items-center justify-center">
                  <p className="bg-transparent text-white w-full text-center text-xsm !outline-none placeholder:text-[#626262]">
                    {isCreatePool ? (
                      <input
                        key="TokenTwoByTokenOne"
                        id="TwoByOne"
                        value={Twoby1}
                        type="number"
                        className="bg-transparent text-white w-full text-xsm  text-center !outline-none placeholder:text-[#626262] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e: any) => {
                          setTwoby1(Number(e.target?.value));
                        }}
                      />
                    ) : selectedPool ? (
                      Twoby1
                    ) : (
                      0
                    )}
                  </p>
                  <p className="text-xsm font-normal text-prime-gray-200">
                    {selectedToLiquidity?.symbol || "Token2"} /{" "}
                    {selectedLiquidity?.symbol || "Token1"}{" "}
                  </p>
                </div>
                <div className="relative w-[50%] flex flex-col space-y-1 items-center justify-center">
                  <p className="bg-transparent text-white w-full text-center text-xsm !outline-none placeholder:text-[#626262]">
                    {isCreatePool ? (
                      <input
                        key="Token1/Token2"
                        id="OneByTwo"
                        value={1}
                        disabled={true}
                        className="bg-transparent text-white w-full  text-center text-xsm !outline-none placeholder:text-[#626262] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      1
                    )}
                  </p>
                  <p className="text-xsm font-normal text-prime-gray-200">
                    {selectedLiquidity?.symbol || "Token1"} /{" "}
                    {selectedToLiquidity?.symbol || "Token2"}{" "}
                  </p>
                </div>
              </div>
              {/* Share of Pool */}
              {isCreatePool ? (
                <div className="relative w-full flex flex-row space-x-2 items-center justify-center">
                  {selectedLiquidity && selectedToLiquidity && (
                    <p className="bg-transparent text-white w-[100%] text-center text-xsm !outline-none placeholder:text-[#626262]">
                      1 {selectedLiquidity?.symbol} = {Twoby1}{" "}
                      {selectedToLiquidity?.symbol}
                    </p>
                  )}
                </div>
              ) : (
                <div className="relative w-full flex flex-row space-x-2 items-center justify-center">
                  <p className="bg-transparent text-white w-[40%] text-end text-xsm !outline-none placeholder:text-[#626262]">
                    {selectedLiquidity?.users?.filter(
                      (user: any) => user.address == address
                    ).length
                      ? (Number(
                          selectedLiquidity?.users?.filter(
                            (user: any) => user.address == address
                          )[0].liquidity
                        ) /
                          Number(selectedLiquidity.liquidityTokenBalance)) *
                        100
                      : "0"}
                    %{" "}
                  </p>
                  <p className="text-xbase w-[60%]  text-start font-normal text-prime-gray-200">
                    Share of Pool
                  </p>
                </div>
              )}
            </div>
          </div>

          {isNotSwitch ? (
            <button
              disabled={isDisabled}
              className="disabled:bg-[#39393A]/60 text-white text-base font-nomal bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600  text-center rounded-md w-full h-[40px]"
              onClick={continueTransaction}
            >
              {buttonText}
            </button>
          ) : (
            <button
              className="text-white text-base font-nomal bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:bg-[#39393A]/60 text-center rounded-md w-full h-[40px]"
              onClick={() => {
                switchNetwork(selectedNetwork.chainId);
              }}
            >
              Switch Network
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Liquidity;
