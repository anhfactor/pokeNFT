import React from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";
import pikachu from '../img/pokesite.png';
import tutorial1 from '../img/tutorial1.svg';
import tutorial2 from '../img/tutorial2.svg';
import tutorial3 from '../img/tutorial3.svg';
import { Navbar } from "./NavbarUI";
import { HomeCard } from "./HomeCard";
import './card-style.css';

export function ConnectWallet({ connectWallet, networkError, dismiss, progress }) {
  return (
    <div className="container">
      <Navbar/>
      <div className="row justify-content-md-center">
        <div className="col-md-8 my-auto text-center">
          <h1 className="bd-title"><strong>Become a Pokémon Master</strong></h1>
          <h3>
            <small className="text-muted">Start collecting trading cards using blockchain technology and become the ultimate pokémon trainer.</small>
          </h3>
          {progress ?
          <button type="button" className="btn btn-danger btn-lg mt-3" disabled>Connecting ...</button> :
          <button type="button" className="btn btn-danger btn-lg mt-3" onClick={connectWallet}>Connect your wallet</button> }
        </div>
        <div className="col-md-4 text-center">
          <img src={pikachu} className="img-fluid" />
        </div>
      </div>

      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <div className="text-center mt-4 mb-2">
        <h2 className="text-danger mt-4 mb-2">Gotta catch ’em all</h2>
        <p> Have fun collecting and playing with your friends. </p>
      </div>

      <div className="row justify-content-md-center mt-4 pt-4">
        <div className="col-md-4 text-center">
          <HomeCard imgsrc={tutorial1} cardTitle={"Connect your wallet"} fadeDuration={500}/>
        </div>
        <div className="col-md-4 text-center">
          <HomeCard imgsrc={tutorial2} cardTitle={"Get your cards"} fadeDuration={1500}/>
        </div>
        <div className="col-md-4 text-center">
          <HomeCard imgsrc={tutorial3} cardTitle={"Challenge your friends"} fadeDuration={2500}/>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

    </div>
  );
}