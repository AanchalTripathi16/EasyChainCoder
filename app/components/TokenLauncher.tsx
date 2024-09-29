import React from "react";
import { useState } from "react";

import { ethers } from "ethers";
import Dropdown from "./Dropdown";
import { tokenAbi, tokenBytecode } from "../utils/deployToken";
import { addToken } from "@/services/userService";
import { useLoginContext } from "@/contexts/LoginContext";
import { Networks } from "@/config";
// import { deployTokenContract } from "./deploy";

const TokenLauncher = () => {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    visual: null,
    visualBase64: null,
    totalSupply: "",
    decimals: "",
    chainId: "neo",
  });

  const chainIdOptions = [
    { id: "NEO", value: "neo" },
    { id: "BASE", value: "base" },
    { id: "ARB", value: "arb" },
    { id: "BNB", value: "bnb" },
    { id: "ETH", value: "eth" },
  ];

  const [isDropdown, setIsDropdown] = useState(false);

  const [errors, setErrors] = useState<any>({});
  const { networkData, switchNetwork } = useLoginContext();

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name) {
      newErrors.name = "Token Name is required.";
    } else if (formData.name.length > 20) {
      newErrors.name = "Token Name should be under 20 characters.";
    }

    if (!formData.symbol) {
      newErrors.symbol = "Token symbol is required.";
    } else if (formData.symbol.length > 20) {
      newErrors.symbol = "Token symbol should be under 20 characters.";
    }

    if (!formData.visual) {
      newErrors.visual = "Token image is required.";
    }

    if (!formData.totalSupply) {
      newErrors.totalSupply = "Token supply is required.";
    }

    if (!formData.decimals) {
      newErrors.decimals = "Token decimals is required.";
    }

    if (!formData.chainId) {
      newErrors.chainId = "Chain id is required.";
    }

    return newErrors;
  };

  const handleImageUpload = (file: any) => {
    const reader: any = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        visual: file,
        visualBase64: reader.result, // Store the base64 data in the state
      });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "visual" && files && files[0]) {
      handleImageUpload(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const deployTokenContract = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request MetaMask account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Set up provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Create a ContractFactory with the ABI, bytecode, and signer (from MetaMask)
        const contractFactory = new ethers.ContractFactory(
          tokenAbi,
          tokenBytecode,
          signer
        );

        // Token constructor parameters
        const name = "MyOmniToken"; // Replace with desired token name
        const symbol = "MOT"; // Replace with desired token symbol
        const initialSupply = ethers.parseUnits("1000000", 18); // Replace with initial token supply
        const minterAddress = await signer.getAddress(); // Get the connected MetaMask account
        const isMainChain = false; // Set according to your need

        // Deploy the contract
        console.log("Deploying token contract...");
        const contract = await contractFactory.deploy(
          name,
          symbol,
          initialSupply,
          minterAddress,
          isMainChain
        );

        // Wait for the transaction to be confirmed
        console.log("Waiting for deployment transaction to be confirmed...");
        await contract.waitForDeployment();

        // Log contract address
        console.log("Token deployed at address:", contract.target); // Use `contract.target` to get the deployed contract address
        return contract;
      } catch (error) {
        console.error("Failed to deploy contract:", error);
      }
    } else {
      console.error(
        "MetaMask is not installed. Please install MetaMask to use this feature."
      );
    }
  };
  function base64ToBuffer(base64String: string): Uint8Array {
    return Uint8Array.from(Buffer.from(base64String, "base64"));
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      console.log("Form data:", formData);
      // Handle form submission
      const provider = new ethers.BrowserProvider(window.ethereum);
      const deploy = await deployTokenContract();
      try {
        await addToken({
          name: formData.name,
          symbol: formData.symbol,
          visual: base64ToBuffer(formData.visual!),
          totalSupply: formData.totalSupply,
          decimals: formData.decimals,
          chainId: formData.chainId,
        });
      } catch (error) {}
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-zinc-500 bg-zinc-900 rounded p-6 flex flex-col items-start justify-center gap-10"
    >
      <h2 className="m-auto border-b border-zinc-600 w-full text-center pb-6 text-2xl font-semibold">
        Token Creator
      </h2>
      <div className="flex flex-row items-center justify-between gap-6">
        <div className="w-full flex flex-col gap-4 items-stretch justify-stretch">
          {/* Name Field */}
          <div className="w-full flex justify-between items-center">
            <label htmlFor="name">Token Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="eg, TESTZR12"
              className="h-[40px] rounded-md text-white placeholder:text-zinc-400 bg-zinc-800 border border-zinc-900 px-2"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {errors.name && <span className="text-red-500">{errors.name}</span>}

          {/* Symbol Field */}
          <div className="w-full flex justify-between items-center">
            <label htmlFor="symbol">Token Symbol</label>
            <input
              type="text"
              id="symbol"
              name="symbol"
              placeholder="eg. TRZ12"
              className="h-[40px] rounded-md text-white placeholder:text-zinc-400 bg-zinc-800 border border-zinc-900 px-2"
              value={formData.symbol}
              onChange={handleChange}
            />
          </div>
          {errors.symbol && (
            <span className="text-red-500">{errors.symbol}</span>
          )}

          {/* Total Supply Field */}
          <div className="w-full flex justify-between items-center">
            <label htmlFor="totalSupply">Total Supply</label>
            <input
              type="number"
              id="totalSupply"
              name="totalSupply"
              className="h-[40px] rounded-md text-white placeholder:text-zinc-400 bg-zinc-800 border border-zinc-900 px-2"
              value={formData.totalSupply}
              onChange={handleChange}
            />
          </div>
          {errors.totalSupply && (
            <span className="text-red-500">{errors.totalSupply}</span>
          )}

          {/* Decimals Field */}
          <div className="w-full flex justify-between items-center">
            <label htmlFor="decimals">Decimals</label>
            <input
              type="number"
              id="decimals"
              name="decimals"
              className="h-[40px] rounded-md text-white placeholder:text-zinc-400 bg-zinc-800 border border-zinc-900 px-2"
              value={formData.decimals}
              onChange={handleChange}
            />
          </div>
          {errors.decimals && (
            <span className="text-red-500">{errors.decimals}</span>
          )}

          {/* Chain ID Field */}
          <div className="w-full flex justify-between items-center">
            <label htmlFor="chainId">Chain ID</label>
            <Dropdown
              options={chainIdOptions}
              isOpen={isDropdown}
              setIsOpen={setIsDropdown}
              value={formData.chainId}
              handleClick={(value: any) =>
                setFormData({ ...formData, chainId: value?.value })
              }
            />
          </div>
          {errors.chainId && (
            <span className="text-red-500">{errors.chainId}</span>
          )}
        </div>

        {/* Visual (Image) Field */}
        <div className="w-full flex flex-col justify-center items-center h-full gap-3">
          <label htmlFor="visual">Token Image</label>
          {formData.visualBase64 ? (
            <div>
              <img
                src={formData.visualBase64}
                alt="Token Preview"
                className="size-[300px] object-contain mt-3"
              />
            </div>
          ) : (
            <div>
              <img
                src="http://loremflickr.com/500/500"
                alt="Token Preview"
                className="size-[300px] filter grayscale brightness-50"
              />
            </div>
          )}
          <input
            type="file"
            id="visual"
            name="visual"
            className="px-4 w-full flex flex-col items-center justify-center"
            onChange={handleChange}
          />
          {errors.visual && (
            <span className="text-red-500">{errors.visual}</span>
          )}
        </div>
      </div>
      {Networks.filter((item: any) => item.code == formData?.chainId)[0]
        .chainId != networkData?.chainId ? (
        <button
          className="text-white h-[40px] w-[220px] m-auto bg-blue-800 rounded-md"
          onClick={() => {
            switchNetwork(
              Networks.filter((item: any) => item.code == formData?.chainId)[0]
                .chainId
            );
          }}
        >
          Switch Network
        </button>
      ) : (
        <button
          className="text-white h-[40px] w-[220px] m-auto bg-blue-800 rounded-md"
          type="submit"
        >
          Submit
        </button>
      )}
    </form>
  );
};

export default TokenLauncher;
