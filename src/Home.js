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

const [myOrcs, setMyorcs] = useState();
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
const rndInt = Math.floor(Math.random() * 5050) + 1

let arry = []
let objarry = []

arry = Array.from({length: 12}, () => Math.floor(Math.random() * 5050));

arry.map((a)=>{
  objarry.push({tokenId: a})
})

setMyorcs(objarry)

},[0])
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

              {/* <Leaderboard /> */}<div class="md:w-2/3 border-2 shadow-lg p-2">
              <div class="text-lg font-bold font-serif flex flex-wrap justify-center">SOME RANDOM ORCS</div>  

            
              <div class="flex flex-wrap">

                {myOrcs && myOrcs.map((orc, index)=>{
                    let classes = "hover:bg-gray-100"
                
                    return(
                    <div key={orc.tokenId} class={`w-1/2 md:w-1/4 pointer-events-auto ${classes}`} onClick={()=> setOrcId(orc.tokenId)}>
                    <Orc allData={false} key={orc.tokenId} tokenid={parseInt(orc.tokenId)} />
                    </div>
                    )
                })}
                </div>                    </div>
           

              
              </div> 
       

        

        </div>
    

</div>
   

<p class="font-medium">Credits: Frontend concept by Husky Studios, creators of <a target="_blank" href="https://hilarioushuskies.life">Hilarious Huskies </a>. Support the creator by getting yours <a target="_blank" href="https://hilarioushuskies.life/mint">now!</a></p>

<div class="border-2 p-y-2">
  <h2>Resources</h2>
<p>Contract: https://etherscan.io/address/0x3abedba3052845ce3f57818032bfa747cded3fca#code</p>
<p>Dune Analytics: https://dune.xyz/Marcov/EtherOrcs</p>

</div>

</div>





  );
}

export default App;



