import { useState, useEffect } from "react";
import Home from "./Home"
import { createBrowserHistory } from 'history';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Horde from "./Horde";
import {
getContract, getCurrentWalletConnected
  
} from "./utils/interact.js";
import Leaderboard from "./Leaderboard";
import Owners from "./OwnersCount";
const history = createBrowserHistory();
//bg-light-image
function App() {
  
  const {nftContract, ercContract, web3} = getContract()
  const [wallet, setWallet] = useState("")
  const [flip, setFlip] = useState(false)
  
  let adminWallet = "0xCcB6D1e4ACec2373077Cb4A6151b1506F873a1a5"

  useEffect(async() => {
    const {address} = await getCurrentWalletConnected()
    setWallet(address)
    if(address.toLowerCase() === adminWallet.toLowerCase()){
      setFlip(true)
    }

  }, [])

  
 return (
    <>
      {/*  <Helmet>
    <title>Orcs</title>
      <meta name="Hilarious Huskies is an NFT collection inspired a beautiful pup named Hazel." content="Hilarious Huskies is an NFT collection inspired a beautiful pup named Hazel." />
      <meta content="summary_large_image" property="twitter:card" />
      <meta content="HilariousHuskies Marketplace: Mint and explore digital assets" property="og:title" />
      </Helmet>
      //class="bg-light-image">
      */ }
<div> 


<div class="container mx-auto space-y-5 ">
  

  <Router history={history}>
    <div class="min-h-screen"> 
      <div class="container mx-auto">             
         
              <Switch>
                
                <Route path="/admin">  

                {flip ? ( <>
                <Horde contract={nftContract} />

          </>) :(`${wallet} Not allowed`)}
               

                 {/*
                                <Leaderboard />
                <Owners />
                
              
             <Activity contract={nftContract} web3={web3} />*/}
                </Route>
                <Route path="/">   
                <Home />
                </Route>
              </Switch>


          
      </div>
      </div>
      </Router>


</div>

</div>

</>


  );
}

export default App;


