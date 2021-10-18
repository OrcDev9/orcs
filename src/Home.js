import ConnectWallet from "./ConnectWallet";
import {
  getCurrentWalletConnected, //import here
  mintNFT, getTokenSupply, getGasPrice, getEthPrice, isSaleActive, getContractPrice, tokensByOwner, getContract, getErc,
  
} from "./utils/interact.js";
import { db } from "./initFirebase";
import { getDatabase, ref, set, onValue, query, get,child, equalTo, orderByValue, push, orderByChild, limitToFirst, limitToLast, startAt, endAt} from "firebase/database";
import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import {app, analytics} from "./initFirebase"
import logo from "./media/logo.svg"
import Orc from "./Orc"
import Stake from "./staking";
import Levels from "./levels";
import { Form } from "react-bootstrap";
import { Tab } from "react-bootstrap";
import { Tabs } from "react-bootstrap";
import Mint from "./Mint";
import Activity from "./Activity";
import Horde from "./Horde";
import MyOrcs from "./myOrc";
import Pillage from "./Pillage";

function App() {

const {nftContract, ercContract, web3} = getContract()
const [qty, setQty] = useState(0);
const [walletAddress, setWallet] = useState("");
const [status, setStatus] = useState("");
const [zug, setZug] = useState("");
const [zugClaim, setZugClaim] = useState("");
const [cost, setCost] = useState(0);
const [price, setPrice] = useState(qty * cost);
const [ethprice, setEthPrice] = useState(0);
const [txProgress, setTxProgress] = useState(0);
const [txIntervalId, setTxIntervalId] = useState();
const [tokenSupply, setTokenSupply] = useState();
const [isMetamask, setIsMetamask] = useState(true);
const [activeSale, setActiveSale] = useState(true);
const [gasPrice, setGasPrice] = useState(0);
const [collections, setCollection] = useState([]);
const [orcId, setOrcId] = useState(69);
const [showCollectionToggle, setShowCollectionToggle] = useState(false);
const [myOrcs, setMyOrcs] = useState();

const orcLookupRef = useRef(0);

const wallet4 = "0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"
const tempAddress = "0x3FE61420C33b0E41DDd763adaAeB0b638E78b768"
let wallet2 = "0x5f6810da9379d650676a4452f3415ce743fefe14"
let walletballer = "0xf84f2f86be594dCcCd4c192Ab8058f9F73fB25e7"

const places = [{ "places": ["TOWN", "DUNGEON", "CRYPT", "CASTLE", "DRAGONS_LAIR", "THE_ETHER", 
  "TAINTED_KINGDOM", "OOZING_DEN", "ANCIENT_CHAMBER", "ORC_GODS"] }]

///Test
                

 useEffect(async () => {


   const {address, status} = await getCurrentWalletConnected();

   setWallet(address)
   setStatus(status);
   addWalletListener(); 


   


   
  setTokenSupply(await nftContract.methods.totalSupply().call());
  setZug(web3.utils.fromWei(await ercContract.methods.balanceOf(address).call()))


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


function addWalletListener() {
   if (window.ethereum) {      
     window.ethereum.on("accountsChanged", (accounts) => {
       if (accounts.length > 0) {
         setWallet(accounts[0]);  
         setIsMetamask(true)        
         setStatus("👆🏽 Select quantity to mint.");
       } else {
         setWallet("");
         setStatus("🦊 Connect to Metamask using the top right button.");
       }
     });
   } else {
     setStatus(
       <p>
         {" "}
         🦊{" "}
         <a target="_blank" href={`https://metamask.io/download.html`}>
           You must install Metamask, a virtual Ethereum wallet, in your
           browser.
         </a>
       </p>
     );
   }
 }


 const handleOrcSubmit = () => {

  const value = orcLookupRef.current.value;
  const t = parseInt(value)


  if((t > 0) && (t < tokenSupply)){

    setOrcId(value);
  }
    
};





  return (
<div class="container mx-auto space-y-5">
          
       

<div class="flex justify-between">
          
          <div class="flex justify-left align-items-baseline">
              <h1 class="text-5xl md:text-6xl xl:text-7xl font-bold font-serif pr-2 ">Ether</h1>
              <img class="rounded-full" width={70} src={logo} alt="Orcs Logo" />
              <h1 class="text-5xl md:text-6xl xl:text-7xl font-bold font-serif ">rcs</h1>
          </div> 
          <div class="align-self-center">
          <ConnectWallet />
          </div>

</div>

<div>
  {walletAddress && (<MyOrcs address={walletballer} />)}


</div>




<div>
<h2>Contract Stats</h2>
        
        <div class="flex justify-between">
            
            <div>Token Supply: {tokenSupply}</div>
            <div>gasPrice {gasPrice}</div>
            <div>ethprice {ethprice}</div>
            <div>zug {zug} </div>
        </div>
</div>
<div class="space-y-2 p-2 border-2">

<Tabs defaultActiveKey="mint" id="uncontrolled-tab-example" className="mb-3">
  <Tab eventKey="mint" title="Mint">
   <Mint />
  </Tab>


  <Tab eventKey="lookup" title="Lookup Orcs">
  <div class="space-y-2 p-2 border-2">        
<h2>Look up Orc</h2>
<div class="flex flex-wrap space-x-10">
  
  <div>
 
  <Form.Group onSubmit={()=>handleOrcSubmit}>
      <Form.Label>Look up orc, type orc id here</Form.Label>
     
      <Form.Control ref={orcLookupRef}/>
    </Form.Group>
    <Button onClick={()=>handleOrcSubmit()}>Lookup</Button>

  </div> 

<Orc allData={true} tokenid={orcId} />

</div>
</div>
  </Tab>


  <Tab eventKey="activty" title="Activity Sheet">
   <Horde contract={nftContract} />
  </Tab>

</Tabs>     


</div>
   






Credit:
<p class="font-medium">Front end concept by Husky Studios, creators of <a target="_blank" href="https://hilarioushuskies.life">Hilarious Huskies </a>.</p>

</div>



  );
}

export default App;


