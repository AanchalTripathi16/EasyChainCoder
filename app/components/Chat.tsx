import { useState } from "react";
import axios from "axios";
import { useLoginContext } from "@/contexts/LoginContext";
import { Networks, TokenList } from "@/config";
import { switchNetwork } from "wagmi/actions";

const ChatAI = () => {
  const [messages, setMessages] = useState<any>([]); // For storing chat history
  const [input, setInput] = useState<any>(""); // For storing user input
  const [loading, setLoading] = useState<any>(false); // Loading state
  const [functionList, setFunctionList] = useState<any>([]); //{ provideLiquidity:["amountA", "amountB", "chain"] } // functions with their arguments
  const [chainData, setChainData] = useState<any>([]); //{ "bssepolia": ["provideLiquidity"]} -  All functions for a particular chain
  const {
    CreatePool,
    selectedPool,
    setSelectedLiquidity,
    setSelectedToLiquidity,
    address,
    selectedNetwork,
    fromAmount,
    toAmount,
    poolList,
    setFromAmount,
    setSelectedNetwork,
    setSelectedPool,
    setTwoby1,
    networkData,
  } = useLoginContext();

  const apiUrl = "http://139.59.3.8:8001/ai/ask"; // API URL

  const chainAbbre = {
    neo: "neo",
    sepolia: "sepolia",
    "BNB Smart Chain": "bsc",
    "Base Sepolia": "bssepolia",
    "Arbitrum Sepolia": "arbsepolia",
  };

  const [messageHistory, setMessageHistory] = useState<any[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return; // Avoid sending empty input

    // Add user's message to the chat

    setMessages((prevMessages: any) => [
      ...prevMessages,
      { text: input, sender: "user" },
    ]);

    try {
      setLoading(true);
      // const messageHistory = messages.filter((message) => message.sender === "user").map((message) => message.text);
      const queryInput = [...messageHistory, input];
      const response = await axios.post(apiUrl, { query: queryInput });

      const { success, message, data } = response.data;

      // Getting data from response
      if (success) {
        const { function_name, function_arguments } = data;
        setFunctionList([
          ...functionList,
          { [function_name]: Object.keys(function_arguments) },
        ]);
        console.log(functionList);
        if (chainData[function_arguments["chain"]])
          setChainData({
            ...chainData,
            [function_arguments["chain"]]: [
              ...chainData[function_arguments["chain"]],
              function_name,
            ],
          });
        else
          setChainData({
            ...chainData,
            [function_arguments["chain"]]: [function_name],
          });
      }

      // Add bot's response to the chat
      setMessageHistory([...messageHistory, input]);
      setMessages((prevMessages: any) => [
        ...prevMessages,
        { isFunctionalData: success, data: data, text: message, sender: "bot" },
      ]);

      setInput(""); // Clear the input field
    } catch (error) {
      console.log("eerrr", error);
      const errorMessage = { text: "Error fetching response.", sender: "bot" };
      setMessages((prevMessages: any) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleBtnClick = async (data: any) => {
    const { function_name, function_arguments } = data;
    console.log("first", function_name, function_arguments);
    switch (function_name) {
      case "createPool":
        //Switch Network
        if (
          networkData.chainId !=
          Networks.filter((network: any) => {
            network.code == function_arguments.chain;
          })[0].chainId
        ) {
          switchNetwork(selectedNetwork?.chainId);
        }
        setSelectedNetwork(
          Networks.filter((network: any) => {
            network.code == function_arguments.chain;
          })[0]
        );
        setSelectedLiquidity(
          TokenList.filter(
            (token: any) => token.symbol == function_arguments.tokenA
          )[0]
        );
        setSelectedToLiquidity(
          TokenList.filter(
            (token: any) => token.symbol == function_arguments.tokenB
          )[0]
        );
        setTwoby1(
          Number(function_arguments.amountB) /
            Number(function_arguments.amountA)
        );
        setFromAmount(function_arguments.amountA);

        try {
        } catch (error: any) {}

        break;
      case "provideLiquidity":
        setSelectedLiquidity(
          TokenList.filter(
            (token: any) => token.symbol == function_arguments.tokenA
          )[0]
        );
        setSelectedToLiquidity(
          TokenList.filter(
            (token: any) => token.symbol == function_arguments.tokenB
          )[0]
        );
        if (
          networkData.chainId !=
          Networks.filter((network: any) => {
            network.code == function_arguments.chain;
          })[0].chainId
        ) {
          switchNetwork(selectedNetwork?.chainId);
        }
        setSelectedNetwork(
          Networks.filter((network: any) => {
            network.code == function_arguments.chain;
          })[0]
        );
        poolList.filter((pool: any) => {
          (pool.firstTokenAddress ==
            TokenList.filter(
              (token: any) => token.symbol == function_arguments.tokenB
            )[0].address ||
            pool.firstTokenAddress ==
              TokenList.filter(
                (token: any) => token.symbol == function_arguments.tokenA
              )[0].address) &&
            (pool.secondTokenAddress ==
              TokenList.filter(
                (token: any) => token.symbol == function_arguments.tokenB
              )[0].address ||
              pool.secondTokenAddress ==
                TokenList.filter(
                  (token: any) => token.symbol == function_arguments.tokenA
                )[0].address);
        });
        if (
          poolList.filter((pool: any) => {
            (pool.firstTokenAddress ==
              TokenList.filter(
                (token: any) => token.symbol == function_arguments.tokenB
              )[0].address ||
              pool.firstTokenAddress ==
                TokenList.filter(
                  (token: any) => token.symbol == function_arguments.tokenA
                )[0].address) &&
              (pool.secondTokenAddress ==
                TokenList.filter(
                  (token: any) => token.symbol == function_arguments.tokenB
                )[0].address ||
                pool.secondTokenAddress ==
                  TokenList.filter(
                    (token: any) => token.symbol == function_arguments.tokenA
                  )[0].address);
          }).length
        ) {
          setSelectedPool(
            poolList.filter((pool: any) => {
              (pool.firstTokenAddress ==
                TokenList.filter(
                  (token: any) => token.symbol == function_arguments.tokenB
                )[0].address ||
                pool.firstTokenAddress ==
                  TokenList.filter(
                    (token: any) => token.symbol == function_arguments.tokenA
                  )[0].address) &&
                (pool.secondTokenAddress ==
                  TokenList.filter(
                    (token: any) => token.symbol == function_arguments.tokenB
                  )[0].address ||
                  pool.secondTokenAddress ==
                    TokenList.filter(
                      (token: any) => token.symbol == function_arguments.tokenA
                    )[0].address);
            })[0]
          );
          setTwoby1(
            Number(
              selectedPool.secondTokenBalance / selectedPool.firstTokenBalance
            ).toFixed(2)
          );
          setFromAmount(function_arguments.amountA);
        } else {
          console.log("Pool Not Exist");
        }
        break;

      default:
        break;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl h-[600px] bg-zinc-900 border border-zinc-500 rounded gap-1">
      {/* Chat Box */}
      <div className="flex-grow p-4 overflow-y-auto flex flex-col">
        {messages.map((message: any, index: any) => (
          <div
            key={index}
            className={`p-2 rounded-md my-2 max-w-lg ${
              message.sender === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-300 text-black self-start"
            }`}
          >
            {message.isFunctionalData ? (
              <button
                className="p-2 border-2 rounded border-zinc-800 bg-slate-600 text-white flex flex-wrap items-center hover:bg-slate-800"
                onClick={() => handleBtnClick(message.data)}
              >
                {message.data.function_name} |{" "}
                {Object.entries(message.data.function_arguments).map(
                  ([key, value]: any[], i) => (
                    <div
                      key={i}
                      className="border border-zinc-300 py-0.5 px-1 flex"
                    >
                      {key}:{value},
                    </div>
                  )
                )}
              </button>
            ) : (
              message.text
            )}
          </div>
        ))}
        {loading && (
          <div className="p-2 rounded-lg my-2 max-w-lg bg-gray-300 text-black self-start">
            Typing...
          </div>
        )}
        {!loading && messageHistory.length !== 0 && (
          <>
            <hr className="w-full h-[1px] bg-slate-100" />
            <button
              className="p-2 mx-auto border-t border-zinc-200 text-white border border-zinc self-start"
              onClick={() => setMessageHistory([])}
            >
              End above conversation
            </button>
          </>
        )}
      </div>

      {/* Input Field */}
      <div className="p-4 bg-black border-t flex">
        <input
          type="text"
          className="w-full p-2 rounded focus:outline-none text-black"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-600 text-white rounded-lg"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatAI;
