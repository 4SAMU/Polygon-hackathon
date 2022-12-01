<!-- @format -->

# Building an Interior Design as NFT with Polygon, Next.js, Tailwind, Solidity, Hardhat, Ethers.js, and IPFS

When a user puts an design(as nft) for sale, the ownership of the item will be transferred from the creator to the marketplace contract.<br />

When a user purchases an NFT, the purchase price will be transferred from the buyer to the seller and the item will be transferred from the marketplace to the buyer.<br />

The marketplace owner will be able to set a listing fee. This fee will be taken from the seller and transferred to the contract owner upon completion of any sale,<br /> enabling the owner of the marketplace to earn recurring revenue from any sale transacted in the marketplace.

# Prerequisites

-Node.js version 16.14.0 or greater installed on your machine. I recommend installing Node using either nvm or fnm.
-Metamask wallet extension installed as a browser extension

# The Stack

Web application framework - [Next.js](https://nextjs.org/) <br />
Solidity development environment - [Hardhat](https://hardhat.org/) <br />
File Storage - [IPFS](https://nft.storage/) <br />
Ethereum Web Client Library -[ Ethers.js](https://docs.ethers.io/v5/) <br />

# Setting up Tailwind CSS

```shell
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

npx tailwindcss init -p

```

# in tailwind.config.js:

```js
/* tailwind.config.js */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

# Finally, delete the code in styles/globals.css and update it with the following:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

# hardhat.config.js

```js
/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.privateKey],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
```

# verified contract

[Verified contract](https://mumbai.polygonscan.com/address/0x9c94B22944c65467E160bdD4726B85253E357798#code)

