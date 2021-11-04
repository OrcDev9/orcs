import { useState, useEffect } from "react";
import Home from "./Home"
import { createBrowserHistory } from 'history';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Horde from "./Horde";
import {getContract, getCurrentWalletConnected} from "./utils/interact.js";

import { Helmet } from "react-helmet";
import GetAllOrcMetaData from "./OrcMetaData";
import OrcImages from "./OrcImages";
const history = createBrowserHistory();

function App() {
  
  const {nftContract} = getContract()
  const [wallet, setWallet] = useState("")
  const [flip, setFlip] = useState(false)

  let husky ="0xCcB6D1e4ACec2373077Cb4A6151b1506F873a1a5"
  let john = "0x6Ab133Af137fd94294aFbc4dFDEbb6ded94A572d"
  let wrangler = "0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"
  
  let adminWallet = [husky.toLowerCase(), john.toLowerCase(), wrangler.toLowerCase() ]

  useEffect(async() => {
    const {address} = await getCurrentWalletConnected()
    setWallet(address)
    if(adminWallet.includes(address.toLowerCase())){
      setFlip(true)
    }

  }, [])

  
 return (
    <>
<Helmet>
    <title>EtherOrcs Contract GUI</title>
      <meta name="EtherORcs" content="EtherOrcs is a collection of 5050 Orcs ready to pillage the blockchain. With no IPFS or API, these Orcs are the very first role-playing game that takes place 100% on-chain. For the HORDE!" />
      <meta content="summary_large_image" property="twitter:card" />
      <meta content="EtherOrcs GUI by HilariousHuskies" property="og:title" />
</Helmet>

<div class="container mx-auto space-y-5 text-white">
  

  <Router history={history}>
    <div class="min-h-screen"> 
      <div class="container mx-auto">             
         
              <Switch>
                <Route path="/admin">  
                      {flip ? ( <>
                      <Horde contract={nftContract} />
                      <GetAllOrcMetaData />
                      <OrcImages />


                </>) :(`${wallet} Not allowed`)}
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
)}

export default App;


