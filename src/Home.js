import {
  getCurrentWalletConnected, getGasPrice, getEthPrice, getContract  
} from "./utils/interact.js";
import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import {app, analytics} from "./initFirebase"
import Orc from "./Orc"
import { Form } from "react-bootstrap";
import { Tab } from "react-bootstrap";
import { Tabs } from "react-bootstrap";
import Horde from "./Horde";
import MyOrcs from "./myOrc";
import InputGroup from 'react-bootstrap/InputGroup'
import Chat from "./orcChat"
import Leaderboard from "./Leaderboard.js";
function App() {

const {nftContract, ercContract, web3} = getContract()
//setZug((await ercContract.methods.balanceOf(address).call()))
const [qty, setQty] = useState(0);

const [status, setStatus] = useState("");
const [zug, setZug] = useState("");
const [zugClaim, setZugClaim] = useState("");
const [cost, setCost] = useState(0);
const [price, setPrice] = useState(qty * cost);
const [ethprice, setEthPrice] = useState(0);
const [tokenSupply, setTokenSupply] = useState();
const [walletAddress, setWallet] = useState("");
const [isMetamask, setIsMetamask] = useState(true);
const [gasPrice, setGasPrice] = useState(0);
const [showOrc, setShowOrc] = useState(true);
const [orcId, setOrcId] = useState(1);

const orcLookupRef = useRef(1);


useEffect(async () => {

setTokenSupply(await nftContract.methods.totalSupply().call());


getEthPrice().then((ethprice)=>{
  setEthPrice(parseFloat(ethprice.result.ethusd));
})

getGasPrice().then(function(gasPriceData){
  try{
    setGasPrice(gasPriceData.result.ProposeGasPrice)
  }catch(e){
    console.log(e)
  }     
});

}, []);

const handleOrcSubmit = (e) => {
  e.preventDefault()
  const value = orcLookupRef.current.value;
  const t = parseInt(value)


  if((t > 0) && (t < 5050)){

    setOrcId(value);
  }
setShowOrc(true)

    
};





  return (
<div class="container mx-auto space-y-5">
      
  <MyOrcs />

<div class="space-y-2 p-2 border-2">

<div class="space-y-2 p-2 border-2">        
         
          <div class="flex flex-wrap justify-arround">

                  <div class="md:w-1/3 border-2 shadow-lg p-2">
                  <div class="text-lg font-bold font-serif flex flex-wrap justify-center">LOOK UP ORC</div>  
                  <div class="flex flex-wrap justify-center">
                       <form onSubmit={handleOrcSubmit}>
                    <input  placeholder={"Type Orc Id here"} ref={orcLookupRef} />
                    <button class="hidden" type="submit">Unleash the Orc</button> 
                    </form>    
                  </div>  
              {showOrc && <Orc allData={true} tokenid={orcId} />}
              </div>

              <div class="md:w-2/3 border-2 shadow-lg p-2">
               <Leaderboard />
              </div>


              
              </div> 
       

        

        </div>
    

</div>
   

<p class="font-medium">Credits: Frontend concept by Husky Studios, creators of <a target="_blank" href="https://hilarioushuskies.life">Hilarious Huskies </a>. Support the creator by getting yours <a target="_blank" href="https://hilarioushuskies.life/mint">now!</a></p>

</div>



  );
}

export default App;


