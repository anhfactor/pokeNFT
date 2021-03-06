import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/PokeToken.json";
import contractAddress from "../contracts/token-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import ReactCardFlip from 'react-card-flip';
import { Navbar } from "./NavbarUI";
import backcard from '../img/backcard.png';
import tab1 from '../img/tab1.png';
import tab2 from '../img/tab2.png';

// Ceramix DID
import { ThreeIdConnect,  EthereumAuthProvider } from '@3id/connect'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import {DID} from 'dids';
import CeramicClient from '@ceramicnetwork/http-client';
import KeyDidResolver from 'key-did-resolver'
import {IDX} from '@ceramicstudio/idx';


// This is the Buidler EVM network id, you might change it in the buidler.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
//const BUIDLER_EVM_NETWORK_ID = '31337';
const BUIDLER_EVM_NETWORK_ID = '42'; // Kovan network

// This is info for Ceramic network
const CERAMIC_TESTNET_URL="https://ceramic-clay.3boxlabs.com"
const ceramic = new CeramicClient(CERAMIC_TESTNET_URL);
const idx = new IDX({ ceramic })

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      balance: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
      pokeToken: undefined,
      isFlipped: false,
      pokeData: undefined,
      moveData: undefined,
      myCards: [],
      currentCard: undefined,
      userDID: undefined, // 3DID authentication
      progress: false,
      name: '',
      age: '',
      about: '' 
    };

    this.state = this.initialState;
    this.handleChange = this.handleChange.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  async updateProfile() {
    console.log(this.state.selectedAddress)
    const content = {
      name: this.refs.name.value,
      age: this.refs.age.value,
      about: this.refs.about.value
    }
    await idx.set('basicProfile', content)
    alert("Your profile have been updated")
  }
  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet 
          connectWallet={() => this._connectWallet()} 
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
          progress={this.state.progress}
        />
      );
    }

    // If the token data or the user's balance hasn't loaded yet, we show
    // a loading component.
    if (!this.state.tokenData || !this.state.balance) {
      return <Loading />;
    }
    return (
      <div className="container">
        <Navbar/>
        <Tabs>
        <TabList>
          <Tab><img src={tab1} height="32" width="32" alt="pokeNFT"/> Claim pokemon cards </Tab>
          <Tab><img src={tab2} height="32" width="32" alt="pokeNFT"/> Edit profile</Tab>
        </TabList>
        <TabPanel>
        <div className="row justify-content-md-center d-flex align-items-center">
          <div className="col-md-6 text-center d-inline-flex flex-column align-items-center">
            <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal">
                
                <div className="bg-light pb-2 pt-2 pr-2 pl-2 d-flex rounded card card-with-shadow" style={{height: '375px', width: '250px'}}>
                  <img style={{height: '230px'}} className="card-img-top" src={backcard} alt="pokeNFT"/>
                </div>

                <div className="bg-warning pb-2 pt-2 pr-2 pl-2 d-flex rounded card card-with-shadow" style={{height: '375px', width: '250px'}}>
                  <div className="card text-white bg-primary d-flex pr-2 pl-2">
                    <div style={{padding: '0px'}} className="card-header mt-2">
                      <h5><strong>#{this.state.pokeToken} {this.state.pokeData && this.state.pokeData.name}</strong></h5>
                    </div>
                    <div className="card border-light bg-light">
                      <img style={{height: '150px'}} src={this.state.pokeData && this.state.pokeData.image} className="card-img-top" alt="..."/>
                    </div>
                    <div className="card-footer pb-0 pr-2 pl-2" style={{height: '155px'}}>
                      <div style={{height: '108px'}}>
                        <div className="d-flex flex-row">
                          <h5>{this.state.moveData && this.state.moveData.skill}</h5>
                        </div>
                        <div className="d-flex flex-row">
                          <p className="card-text"><small>{this.state.moveData && this.state.moveData.skill_description}</small></p>
                        </div>
                      </div>
                      <div className="d-flex flex-row-reverse align-self-end">
                        <h5>{this.state.moveData && this.state.moveData.damage} pts</h5>
                      </div>
                    </div>
                  </div>
                </div>  

            </ReactCardFlip>
          </div>
          <div className="col-md-6 text-center d-inline-flex flex-column align-items-center">
            
            <div className="jumbotron  pt-3 pb-5 mb-0">
              <img className="mb-1" src="https://i.pinimg.com/originals/ad/e4/ae/ade4aee3ca5c50f9b02ab18a58596a24.png" alt="pokeNFT" />
                <button type="button" className="btn btn-danger btn-lg mt-3" onClick={() => this._awardToken()}>Claim your NFT pokemon cards</button>
              {this.state.balance.gt(0) && (
                <div>
                  <h5>Select your card:</h5>
                  <select className="form-control" onChange={(event) => this._getCardData(this.state.myCards.findIndex(card => card.toString() === event.target.value.toString()))}
                    value={this.state.currentCard}>
                    {this.state.myCards.map(card => (
                      <option value={card}>{"Collector Card #" + card.toString()}</option>
                    ))}
                  </select>
                </div>
              )} 
            </div> 

          </div>
        </div>
        </TabPanel>
        <TabPanel>
          <h4>Your DID: </h4><p>{this.state.userDID}</p>
          <h4>Card you own: {this.state.myCards.length}</h4>
          <form>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">@</span>
              </div>
              <input type="text" class="form-control" placeholder="Name" defaultValue={this.state.name} ref="name"
                aria-label="Name" aria-describedby="basic-addon1" onChange={this.handleChange}/>
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">@</span>
              </div>
              <input type="text" class="form-control" placeholder="Age" defaultValue={this.state.age} ref="age"
                aria-label="Age" aria-describedby="basic-addon1" onChange={this.handleChange}/>
            </div>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">About your self</span>
              </div>
              <textarea class="form-control" aria-label="With textarea" ref="about"
              onChange={this.handleChange} defaultValue={this.state.about}/>
            </div>
              <br/>
              <input class="btn btn-primary" type="button" value="Update" 
                  onClick={this.updateProfile}/>
          </form>
        </TabPanel>
        </Tabs>
      </div>
    );

  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.enable();

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!this._checkNetwork()) {
      return;
    }
    // Request authentication using 3IDConnect.
    const threeIdConnect = new ThreeIdConnect();
    const authProvider = new EthereumAuthProvider(window.ethereum, selectedAddress);
    await threeIdConnect.connect(authProvider);
    // Create a DID instance.
    const provider = await threeIdConnect.getDidProvider();

    const resolver = { ...KeyDidResolver.getResolver(),
      ...ThreeIdResolver.getResolver(ceramic) }
    const did = new DID({ resolver })
    // Set the provider to Ceramic
    did.setProvider(provider)
    // Authenticate the 3ID
    this.setState({ progress: true});
    ceramic.did = did;
    try {
      const userDID = await did.authenticate();
      // store userDID
      this.setState({
        userDID: userDID,
      });

      this._initialize(selectedAddress);

      // We reinitialize it whenever the user changes their account.
      window.ethereum.on("accountsChanged", ([newAddress]) => {
        this._stopPollingData();
        // `accountsChanged` event can be triggered with an undefined newAddress.
        // This happens when the user removes the Dapp from the "Connected
        // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
        // To avoid errors, we reset the dapp state 
        if (newAddress === undefined) {
          return this._resetState();
        }
        
        this._initialize(newAddress);
      });
      
      // We reset the dapp state if the network is changed
      window.ethereum.on("networkChanged", ([networkId]) => {
        this._stopPollingData();
        this._resetState();
      });
      this._readProfile();
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({ progress: true});
    }
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._intializeEthers();
    this._getTokenData();
    this._startPollingData();
  }

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._token = new ethers.Contract(
      contractAddress.address,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  async _readProfile() {
    const profile = await idx.get('basicProfile')
    this.setState({
      name: profile.name,
      age: profile.age,
      about: profile.about
    })
  }

  // The next to methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // The next two methods just read from the contract and store the results
  // in the component state.
  async _getTokenData() {
    const name = await this._token.name();
    const symbol = await this._token.symbol();

    this.setState({ tokenData: { name, symbol } });
  }

  async _getCardData(index) {
    if(this.state.balance > 0) {
      this.setState({ isFlipped: false });
      const cors_prefix = "https://cors-anywhere.herokuapp.com/";
      const pokeToken = await this._token.tokenOfOwnerByIndex(this.state.selectedAddress, index);
      this.setState({ pokeToken: pokeToken.toString() });
      const pokeURL = await this._token.tokenURI(pokeToken);
      const pokeGetData = await fetch(cors_prefix + pokeURL);
      const pokeData = await pokeGetData.json();
      this.setState({ pokeData });
      const moveURL = "https://api-poke-nft.herokuapp.com/api/token/" + pokeToken;
      const move = await fetch(cors_prefix + moveURL);
      const moveData = await move.json();
      this.setState({ moveData });
      this.setState({ isFlipped: true });
    }
  }

  async _updateBalance() {
    const balance = await this._token.balanceOf(this.state.selectedAddress);
    this.setState({ balance });
    const cards = [];
    for ( var i = 0; i < balance; i++){
      var card = await this._token.tokenOfOwnerByIndex(this.state.selectedAddress, i);
      cards.push(card);
    }
    if(cards.length > 0 && !this.state.pokeData) {
      this._getCardData(0);
    }
    this.setState({ myCards: cards });
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  // This method checks if Metamask selected network is Localhost:8545 
  _checkNetwork() {
    if (window.ethereum.networkVersion === BUIDLER_EVM_NETWORK_ID) {
      return true;
    }
    this.setState({ 
      networkError: 'Please connect Metamask to Kovan'
    });
    alert(this.state.networkError)
    return false;
  }

  async _awardToken() {
    this._token.awardItem(this.state.selectedAddress);
  }
}
