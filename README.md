# Poke NFT

This project of a Pokémon Trading Card Game using ERC 721 Non-Fungible Tokens. A special token is rewarded to a lucky user using on-chain verifiable random functions. The project i am working on hackathon [Ceramic Sovereign Data Hackathon Bounty
](https://gitcoin.co/issue/smartcontractkit/chainlink/5190/100026736) I use: 

The NFTs were created following [this guide](https://docs.opensea.io/docs/getting-started). The random number generator used to mint the special tokens was created using [this Chainlink VRF tutorial](https://docs.chain.link/docs/get-a-random-number). The authenticate, i am using Decentralized Identity from Ceramic called 3ID [3ID DID Method](https://developers.ceramic.network/authentication/3id-did/method/) and save profile using IDX [IDX documentation](https://developers.idx.xyz/learn/welcome/) 

Wanna see this project live? [Try it out.](http://poke-nft.vercel.app/)

Video demo: [Youtube link](https://youtu.be/tJABW46pJDU)

*Notes: The project running on Kovan testnet.

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/anhnt4288/pokeNFT.git
cd pokeNFT
npm install
```

Before deploying your contract you have to copy the .env_example to .env and set the credentials in your .env file 


Then, on a new terminal, go to the repository's root folder and run this to
deploy PokeToken contract:

```sh
npx buidler run scripts/deploy_PokeToken.js --network kovan
```

Finally, we can run the frontend with:

```sh
cd frontend
npm install
npm start
```

Open [http://localhost:3000/](http://localhost:3000/) to see your Dapp. You will
need to have [Metamask](http://metamask.io) installed and listening to
`the Kovan network`.

## What’s Included?

Your environment will have everything you need to build a Dapp powered by Buidler and React.

- [Buidler](https://buidler.dev/): An Ethereum development task runner and testing network.
- [Chainlink](https://docs.chain.link/docs): A library to interact with a descentralized oracle network.
- [OpenZeppelin](https://docs.openzeppelin.com/openzeppelin/): A library of secure smart contracts.
- [Mocha](https://mochajs.org/): A JavaScript test runner.
- [Chai](https://www.chaijs.com/): A JavaScript assertion library.
- [ethers.js](https://docs.ethers.io/ethers.js/html/): A JavaScript library for interacting with Ethereum.
- [Waffle](https://github.com/EthWorks/Waffle/): To have Ethereum-specific Chai assertions/mathers.
- [A sample frontend/Dapp](./frontend): A Dapp which uses [Create React App](https://github.com/facebook/create-react-app).


## API

Additional information about Chainlink and the database for the metadata API is available in the docs section. There is also an [article on Medium](https://oliver-balfour.medium.com/chainlink-the-decentralized-oracle-70f3bc95007b).

## Troubleshooting

- `Invalid nonce` errors: if you are seeing this error on the `buidler node`
  console, try resetting your Metamask account. This will reset the account's
  transaction history and also the nonce. Open Metamask, click on your account
  followed by `Settings > Advanced > Reset Account`.

## Special credits

[151 pokemon of Kanto icon set by Geovanny Gavilanes](https://www.iconfinder.com/iconsets/151-1)

[Pikachu by Mohammad Ali](https://www.iconfinder.com/icons/1392683/charcter_go_game_pokemon_play_icon)

[Pokemon icons by roundicons.com](https://www.iconfinder.com/iconsets/pokemon-go-vol-1)

[Restful API Poke content](https://pokeapi.co/)

## Future feature
- Trade poke NFT cards.
- PVP with others player.
