import { useState, useEffect } from "react";
import Home from "./Home"
import { createBrowserHistory } from 'history';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Activity from "./Activity";
import {
  getCurrentWalletConnected, //import here
  mintNFT, getTokenSupply, getGasPrice, getEthPrice, isSaleActive, getContractPrice, tokensByOwner, getContract, getErc,
  
} from "./utils/interact.js";
const history = createBrowserHistory();
//bg-light-image
function App() {

  const {nftContract, ercContract, web3} = getContract()

  return (
    <>
      {/*  <Helmet>
    <title>Orcs</title>
      <meta name="Hilarious Huskies is an NFT collection inspired a beautiful pup named Hazel." content="Hilarious Huskies is an NFT collection inspired a beautiful pup named Hazel." />
      <meta content="summary_large_image" property="twitter:card" />
      <meta content="HilariousHuskies Marketplace: Mint and explore digital assets" property="og:title" />
      </Helmet>*/}

<div class="container mx-auto space-y-5 ">
  

  <Router history={history}>
    <div class="min-h-screen"> 
      <div class="container mx-auto">             
         
              <Switch>
                
                <Route path="/gui">   
                {/*<Activity contract={nftContract} web3={web3} />*/}
                </Route>
                <Route path="/">   
                <Home />
                </Route>
              </Switch>


          
      </div>
      </div>
      </Router>


</div>



</>


  );
}

export default App;


