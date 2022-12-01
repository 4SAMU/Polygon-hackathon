/** @format */

import {  useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

import { marketplaceAddress } from "../config";

import NFTMarketplace from "../Marketplace.json";

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const {  price } = formInput;

  // async function fetchNFT() {
  //   if (!tokenURI) return;
  //   const web3Modal = new Web3Modal({
  //     network: "mainnet",
  //     cacheProvider: true,
  //   });
  //   const connection = await web3Modal.connect();
  //   const provider = new ethers.providers.Web3Provider(connection);
  //   const signer = provider.getSigner();

  //   const contract = new ethers.Contract(
  //     marketplaceAddress,
  //     NFTMarketplace.abi,
  //     signer
  //   );
  //   const data = await contract.fetchMyNFTs();

  //   await Promise.all(
  //     data.map(async (i) => {
  //       const tokenURI = await contract.tokenURI(i.tokenId);
  //       const imageUri = tokenURI.slice(7);
  //       const data = await fetch(`https://nftstorage.link/ipfs/${imageUri}`);
  //       const json = await data.json();
  //       const str = json.image;
  //       const mylink = str.slice(7);
  //       const imageX =
  //         "https://nftstorage.link/ipfs/" + mylink.replace("#", "%23");

  //       let price = ethers.utils.formatUnits(i.price.toString(), "ether");
  //       let item = {
  //         price,
  //         tokenId: i.tokenId.toNumber(),
  //         seller: i.seller,
  //         owner: i.owner,
  //         image: imageX,
  //         name: json.name,
  //         description: json.description,
  //       };
  //       return item;
  //     })
  //   );
  //   setImage(image);
  //   updateFormInput((state) => ({ ...state, image: image }));
  // }

  async function listNFTForSale() {
    if (!price) return;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    let transaction = await contract.resellToken(id, priceFormatted, {
      value: listingPrice,
    });
    await transaction.wait();

    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />

        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
