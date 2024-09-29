"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLoginContext } from "./LoginContext";
import useEffectAsync from "@/app/utils/useEffectAsync";
import { ethers } from "ethers";
import SwapAbi from "../consts/Abis/swapAbi.json";
import { getPoolLists } from "@/services/userService";

interface ISwapState {
  setSelectedToNetwork: Dispatch<any>;
  SwapLiquidity: () => Promise<void>;
}

interface User {
  address: string;
  liquidity: string;
  _id: string;
}

interface Pool {
  _id: string;
  poolAddress: string;
  firstTokenAddress: string;
  secondTokenAddress: string;
  firstTokenBalance: string;
  secondTokenBalance: string;
  liquidityTokenBalance: string;
  users: User[];
  chainId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Graph {
  [key: string]: Pool[]; // Maps token addresses to arrays of connected pools
}

let ethereum: any = null;
if (typeof window !== "undefined") {
  ethereum = window?.ethereum;
}

const LoginContext = createContext<ISwapState>({} as ISwapState);

export function useSwapContext() {
  return useContext(LoginContext);
}

export default function SwapProvider({ children }: { children: ReactNode }) {
  const {
    address,
    selectedLiquidity,
    networkData,
    selectedToLiquidity,
    fromAmount,
    toAmount,
    route,
    buttonText,
    poolList,
    selectedNetwork,
    setToAmount,
    setButtonText,
    setPoolList,
    approveLiquidity,
  } = useLoginContext();
  const [pathroute, setPathRoute] = useState<any[]>([]);
  const [selectedToNetwork, setSelectedToNetwork] = useState<any>(null);
  const swapContracts: { [key: string]: string } = {
    Arbitrum: "0xf40FC41d326Af8D45E58C36B1c79b29106CfDBCa",
    BNB: "",
    Neo: "",
    Base: "",
  };

  function validateButtonText() {
    if (!selectedLiquidity || !selectedToLiquidity) {
      setButtonText("Select Token");
    } else if (!fromAmount || !toAmount) {
      setButtonText("Enter Amount");
    } else {
      setButtonText("Swap");
    }
  }
  useEffect(() => {
    if (route == "dex") {
      validateButtonText();
    }
  }, [
    fromAmount,
    selectedLiquidity,
    selectedToLiquidity,
    toAmount,
    networkData,
  ]);

  interface Graph {
    [key: string]: Pool[]; // Maps token addresses to arrays of connected pools
  }

  function buildGraph(poolList: Pool[]): Graph {
    const graph: Graph = {};

    if (poolList?.length) {
      for (const pool of poolList) {
        const { firstTokenAddress, secondTokenAddress } = pool;

        // Add the pool to the graph for both tokens
        if (!graph[firstTokenAddress]) graph[firstTokenAddress] = [];
        if (!graph[secondTokenAddress]) graph[secondTokenAddress] = [];

        graph[firstTokenAddress].push(pool);
        graph[secondTokenAddress].push(pool);
      }
    }

    return graph;
  }

  function bfs(
    graph: Graph,
    startToken: string,
    endToken: string
  ): string[] | null {
    const queue: [string, string[]][] = [[startToken, []]]; // [currentToken, path of pool addresses]
    const visited: Set<string> = new Set();

    while (queue.length > 0) {
      const [currentToken, poolPath] = queue.shift()!;

      if (currentToken === endToken) {
        return poolPath; // Return the path of pool addresses when we reach the end token
      }

      if (visited.has(currentToken)) continue;
      visited.add(currentToken);

      const connectedPools = graph[currentToken] || [];
      for (const pool of connectedPools) {
        const nextToken =
          pool.firstTokenAddress === currentToken
            ? pool.secondTokenAddress
            : pool.firstTokenAddress;

        // Add the current pool's poolAddress to the path
        const newPath = [...poolPath, pool.poolAddress];

        queue.push([nextToken, newPath]);
      }
    }

    return null; // Return null if no path is found
  }
  useEffectAsync(async () => {}, []);
  useEffectAsync(async () => {
    const response: any = await getPoolLists(1, "all");
    setPoolList(response?.data?.pools);
  }, []);

  useEffect(() => {
    if (
      selectedLiquidity &&
      selectedToLiquidity &&
      selectedNetwork.chainId != selectedToNetwork?.chainId
    ) {
      const graph = buildGraph(poolList);

      const shortestPath: any[] | null = bfs(
        graph,
        selectedLiquidity?.address,
        selectedToLiquidity?.address
      );
      setPathRoute(shortestPath!);
    }
  }, [selectedLiquidity, selectedToLiquidity]);

  const SwapLiquidity = async () => {
    try {
      const web3Provider = networkData?.provider as ethers.BrowserProvider;
      const signer = await web3Provider.getSigner(address!);
      let bridgeData = null;

      const tokenContract = await new ethers.Contract(
        swapContracts[selectedNetwork?.name],
        SwapAbi,
        signer
      );
      const lockArgs = [
        selectedLiquidity?.address,
        Number(fromAmount) * 10 ** 18,
        Number(toAmount) * 10 ** 18,
        selectedToLiquidity?.address,
        address,
        pathroute,
      ];
      try {
        await approveLiquidity(
          selectedLiquidity?.address,
          fromAmount,
          pathroute[0]
        );
        try {
          await approveLiquidity(
            selectedToLiquidity?.address,
            toAmount,
            pathroute[0]
          );
        } catch (error: any) {}
      } catch (error: any) {}
      bridgeData = await tokenContract.multiHopSwap(...lockArgs);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log(pathroute);
    if (selectedLiquidity && selectedToLiquidity && pathroute?.length) {
      estimateOutputForShortestPath(
        poolList,
        pathroute,
        selectedLiquidity?.address,
        fromAmount
      );
    }
  }, [fromAmount]);
  function calculateSwapOutput(
    inputAmount: number,
    inputReserve: number,
    outputReserve: number
  ): number {
    return (inputAmount * outputReserve) / (inputReserve + inputAmount);
  }

  function estimateOutputForShortestPath(
    poolList: Pool[],
    shortestPath: string[],
    startToken: string,
    fromAmount: number
  ): any {
    let currentAmount = fromAmount;
    let currentToken = startToken;

    for (const poolAddress of shortestPath) {
      const pool = poolList.find((p) => p.poolAddress === poolAddress);

      if (!pool) {
        throw new Error(`Pool with address ${poolAddress} not found.`);
      }

      let inputReserve: number;
      let outputReserve: number;
      let nextToken: string;

      if (pool.firstTokenAddress === currentToken) {
        // Swap from firstToken to secondToken
        inputReserve = parseFloat(pool.firstTokenBalance);
        outputReserve = parseFloat(pool.secondTokenBalance);
        nextToken = pool.secondTokenAddress;
      } else if (pool.secondTokenAddress === currentToken) {
        // Swap from secondToken to firstToken
        inputReserve = parseFloat(pool.secondTokenBalance);
        outputReserve = parseFloat(pool.firstTokenBalance);
        nextToken = pool.firstTokenAddress;
      } else {
        throw new Error(
          `Current token ${currentToken} not found in pool ${poolAddress}.`
        );
      }

      // Calculate the output for this pool swap
      currentAmount = calculateSwapOutput(
        currentAmount,
        inputReserve,
        outputReserve
      );
      currentToken = nextToken;
    }

    setToAmount(currentAmount.toFixed(4));
  }

  return (
    <LoginContext.Provider value={{ setSelectedToNetwork, SwapLiquidity }}>
      {children}
    </LoginContext.Provider>
  );
}
