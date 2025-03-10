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
    <div className="relative w-full h-[80%] flex flex-col justify-center items-center p-4">
      <div className="relative z-10 flex flex-col w-[90%] max-w-2xl h-[600px] bg-[#1a1a1a]/80 backdrop-blur-md text-white border border-purple-500/30 rounded-xl shadow-lg shadow-pink-500/10 overflow-hidden">
        {/* Chat Header */}
        <div className="relative flex w-full h-[60px] items-center justify-center text-center text-white text-xl font-semibold border-b border-purple-500/20">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Chat with Us
          </span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
          {messages.map((message: any, index: number) => (
            <div
              key={index}
              className={`p-3 rounded-lg my-2 max-w-lg ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white self-end"
                  : "bg-[#2a2a2a] text-white self-start border border-purple-500/20"
              }`}
            >
              {message.isFunctionalData ? (
                <button
                  className="p-2 border border-purple-500/30 rounded-md bg-[#1a1a1a] text-white flex flex-wrap items-center hover:bg-purple-500/20 transition-colors"
                  onClick={() => handleBtnClick(message.data)}
                >
                  <span className="font-medium text-pink-500 mr-2">
                    {message.data.function_name}
                  </span>
                  {Object.entries(message.data.function_arguments).map(
                    ([key, value]: any[], i) => (
                      <div
                        key={i}
                        className="border border-purple-500/30 py-0.5 px-2 rounded-md flex mr-1 mt-1 text-sm"
                      >
                        <span className="text-pink-500 mr-1">{key}:</span>
                        {value}
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
            <div className="p-3 rounded-lg my-2 max-w-lg bg-[#2a2a2a] text-white self-start border border-purple-500/20">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse delay-150"></div>
              </div>
            </div>
          )}
          {!loading && messageHistory.length !== 0 && (
            <>
              <hr className="w-full h-[1px] bg-purple-500/20 my-4" />
              <button
                className="p-2 mx-auto border border-purple-500/30 rounded-md text-pink-500 hover:bg-purple-500/10 transition-colors text-sm"
                onClick={() => setMessageHistory([])}
              >
                End Conversation
              </button>
            </>
          )}
        </div>

        {/* Input Field */}
        <div className="p-4 bg-[#1a1a1a] border-t border-purple-500/20 flex">
          <input
            type="text"
            className="w-full p-3 rounded-md focus:outline-none text-white bg-[#2a2a2a] border border-purple-500/30 placeholder-gray-400 focus:border-pink-500 transition-colors"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-md transition-all duration-300 px-4 disabled:opacity-50"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;
