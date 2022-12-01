/** @format */

import React, { useEffect, useRef, useState } from "react";
import Marketplace from "./../Marketplace.json";
import { ethers } from "ethers";
import { NFTStorage, File } from "nft.storage";
import Web3Modal from "web3modal";

const NEW_TOKEN_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDViOTg4Q0U4NjZBMkQxNTZmNDI5QTcwZDQ5OWExNDM3NmIwNERBOGMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjczNDAxMDk1MSwibmFtZSI6ImNvaW5iYXNlbmZ0In0._E1KnvPg0cJ44QtGx8LN-ZwoZ6CaxkCWybUiOFknVkw";

const CreateNft = () => {
  const [IPFSuploading, setIPFSuploading] = useState(false);
  const [IPFSerror, setIPFSerror] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const inputFileRef = useRef(null);

  function inputFileHandler() {
    if (selectedFile) {
      setSelectedFile(null);
    } else {
      inputFileRef.current.click();
    }
  }

  async function IPFSupload(data, file) {
    try {
      setIPFSerror(null);
      setIPFSuploading(true);
      const client = new NFTStorage({
        token: NEW_TOKEN_KEY,
      });

      const metadata = await client.store({
        name: data.name,
        description: data.description,
        price: data.price,
        image: new File([file], file.name, { type: file.type }),
      });
      console.log("IPFS URL for the metadata:", metadata.url);
      console.log("metadata.json contents:\n", metadata.data);
      console.log("metadata.json with IPFS gateway URLs:\n", metadata.embed());
      return metadata.url;
    } catch (error) {
      setIPFSerror(error);
    } finally {
      setIPFSuploading(false);
    }
  }

  const MintNfts = async (metadataURL) => {
    try {
      // const provider = await detectEthereumProvider();
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer
      );

      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();
      let transaction = await contract.createToken(
        metadataURL,
        ethers.utils.parseEther(formParams.price.toString()),
        {
          value: listingPrice,
        }
      );
      alert("...minting has started");
      await transaction.wait();
      updateFormParams({ name: "", description: "", price: "" });
      selectedFile === null;
      alert("Mint Successfull !");
      setBusy(false);
    } catch (error) {
      if (error) {
        setBusy(false);
        console.log(error);
      }
    }
  };

  async function mintNFThandler() {
    const { name, description, price } = formParams;

    if (!name || !description || !selectedFile || !price) {
      return alert("all field are required");
    }

    try {
      if (formParams.price < 0.01) {
        alert("minimum price is 0.01");
      } else {
        const url = await IPFSupload(
          {
            name,
            description,
            price,
          },
          selectedFile
        );
        await MintNfts(url);
      }
    } catch (error) {
      setBusy(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (IPFSuploading) {
      setBusy(true);
    }
  }, [IPFSuploading]);

  useEffect(() => {
    if (IPFSerror) {
      alert(IPFSerror.code);
      setBusy(false);
    }
  }, [IPFSerror]);

  return (
    <section id="createnft">
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <input
            type="text"
            placeholder="your design"
            className="mt-8 border rounded p-4"
            value={formParams.name}
            id={formParams.name}
            onChange={(e) =>
              updateFormParams({ ...formParams, name: e.target.value })
            }
          />
          <textarea
            minLength="10"
            required
            cols="10"
            rows="5"
            type="text"
            placeholder="design description"
            className="mt-2 border rounded p-4"
            id={formParams.description}
            value={formParams.description}
            onChange={(e) =>
              updateFormParams({ ...formParams, description: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="price"
            className="mt-2 border rounded p-4"
            pattern="^\d*(\.\d{0,4})?$"
            step=".01"
            id={formParams.price}
            value={formParams.price}
            onChange={(e) =>
              updateFormParams({ ...formParams, price: e.target.value })
            }
          />
          <div className="selectfile">
            Select file
            <br />
            <input
              className="text-white"
              ref={inputFileRef}
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              onClick={inputFileHandler}
            ></input>
          </div>
          <button
            className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg"
            onClick={mintNFThandler}
          >
            {busy ? "loading...." : "Mint"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateNft;
