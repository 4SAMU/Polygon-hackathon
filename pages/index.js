/** @format */

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";

import { marketplaceAddress } from "../config";

import NFTMarketplace from "./../Marketplace.json";
import { provider } from "./api/GetNet";

export default function Home() {
  const [currAddress, updateCurrAddress] = useState("0x");
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    // const provider = await getNetwork();
    console.log("this one", provider);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const contract = new ethers.Contract(
        marketplaceAddress,
        NFTMarketplace.abi,
        provider
      );
      const data = await contract.fetchMarketItems();

      /*
       *  map over items returned from smart contract and format
       *  them as well as fetch their token metadata
       */
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenURI = await contract.tokenURI(i.tokenId);
          const imageUri = tokenURI.slice(7);
          const data = await fetch(`https://nftstorage.link/ipfs/${imageUri}`);
          const json = await data.json();
          const str = json.image;
          const mylink = str.slice(7);
          const imageX =
            "https://nftstorage.link/ipfs/" + mylink.replace("#", "%23");

          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller.toUpperCase(),
            owner: i.owner.toUpperCase(),
            image: imageX,
            name: json.name,
            description: json.description,
          };
          return item;
        })
      );
      setNfts(items);
      setLoadingState("loaded");
      updateCurrAddress(accounts[0].toUpperCase());
    } catch (error) {}
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">{nft.price} ETH</p>
                {currAddress === nft.owner || currAddress === nft.seller ? (
                  <button className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded">
                    You own this
                  </button>
                ) : (
                  <button
                    className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded"
                    onClick={() => buyNft(nft)}
                  >
                    Buy
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
