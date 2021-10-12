import ConnectWallet from "./ConnectWallet";
import {
  getCurrentWalletConnected, //import here
  mintNFT, getTokenSupply, getGasPrice, getEthPrice, isSaleActive, getContractPrice, tokensByOwner, getContract, getErc,
  claimZug
} from "./utils/interact.js";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {app, analytics} from "./initFirebase"
import logo from "./media/logo.svg"
import { Alert } from "react-bootstrap";
import Orc from "./Orc"
import Stake from "./staking";
import Levels from "./levels";
import { Form } from "react-bootstrap";

function App() {
  // Define the string
var encodedStringAtoB = 'SGVsbG8gV29ybGQh';

// Decode the String
var decodedStringAtoB = atob(encodedStringAtoB);


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
const [orcId, setOrcId] = useState(1);
const [showCollectionToggle, setShowCollectionToggle] = useState(false);

const places = [{ "places": ["TOWN", "DUNGEON", "CRYPT", "CASTLE", "DRAGONS_LAIR", "THE_ETHER", 
  "TAINTED_KINGDOM", "OOZING_DEN", "ANCIENT_CHAMBER", "ORC_GODS"] }]

///Test
const wallet1 = "0x3edc863789a36f508340ea3f2aa40674139cf5b6"
const wallet2 = "0x80e09203480a49f3cf30a4714246f7af622ba470"
const wallet3 = "0xb3fab8bdf13d493f64e63c2849b0da224994fa76"

                

 useEffect(async () => {


   const {address, status} = await getCurrentWalletConnected();
   setWallet(address)
   setStatus(status);
   addWalletListener(); 


   
  setTokenSupply(await nftContract.methods.totalSupply().call());
  setZug(web3.utils.fromWei(await ercContract.methods.balanceOf(address).call()))

  //const orcProp = await nftContract.methods.orcs(2).call(34)
  
  



   /*
address &&(
   tokensByOwner(address).then((tokenArray)=>{
     setCollection(tokenArray)
}) )


   getContractPrice().then((price)=>{      
   setCost(price);
   })

   isSaleActive().then((sale)=>{      
     setActiveSale(sale);
     })

 
  




  

   
*/


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

 const resetForm = (event) => { //TODO: implement
   event.preventDefault();
   window.location.reload();
   setQty(0)
   setTxProgress(0)
   setStatus("")
   clearInterval(txIntervalId)
   setTxIntervalId(0)

 }
 

 const handleOrcChange = event => {
  event.preventDefault()
  const t = parseInt(event.target.value)

  if((t > 0) && (t < tokenSupply)){

    setOrcId(event.target.value);
  }
  
  
};



 const onMintPressed = async (event) => { //TODO: implement
  setTxProgress(33)
   const { status, txHash, success } = await mintNFT(qty);
   setStatus(status);
   
   ///check for successful transaction
     if(success ===true){
         setTxProgress(100)
          
       }else{
         setTxProgress(0)
      

     }
 };

 const handleZugClaimChange = async (event) => { //TODO: implement
  event.preventDefault()
  setZugClaim(event.target.value)
 };
  
 

 const onClaimZugPressed = async (event) => { //TODO: implement
  setTxProgress(33)
   const { status, txHash, success } = await claimZug(zugClaim);
   setStatus(status);
   
   ///check for successful transaction
     if(success ===true){
         setTxProgress(100)
          
       }else{
         setTxProgress(0)
      

     }
 };

 function MintButtonLogic(props) {    

   if(txProgress === 0)
   return (

     walletAddress && (      
     <Button variant="dark" onClick={onMintPressed}>
     Mint! 
    </Button> ) 
       
   )
   if(txProgress === 100)
   return(
     <Button onClick={resetForm}>
        Reset
       </Button>
   )
   else
   return(
           
     <Button variant="dark" disabled>
      Processing...
   </Button>
   )
 }



  return (
<div class="container mx-auto space-y-5">
  <div class="flex justify-left align-items-center">
  <img class="rounded-full" width={100} src={logo} alt="Orcs Logo" />
  <h1 class="text-5xl md:text-6xl xl:text-9xl font-bold">Ether Orcs</h1>

  </div>
<p class="font-medium">Front end concept by Husky Studios, creators of <a target="_blank" href="https://hilarioushuskies.life">Hilarious Huskies </a>, minting on Friday October 15th.</p>

<ConnectWallet />
<div class="space-y-2 p-2 border-2">

        
<h2>Contract Stats</h2>
<div class="flex justify-between">
<div>
Token Supply: {tokenSupply}
</div>
<div>
gasPrice {gasPrice}
</div>

<div>
ethprice {ethprice}
</div>

<div>
zug {zug} 
</div>
</div>

</div>

<div class="space-y-2 p-2 border-2">
  <div class="flex flex-wrap justify-around">
    <div>
    <h2>Mint</h2>
<MintButtonLogic />

    </div>
    <div>
    <h2>Claim Zug</h2>
    <div class="flex items-bottom space-x-2">
    <Form.Group value={zugClaim} onChange={handleZugClaimChange}>
          <Form.Label>Orc ID</Form.Label>
          <Form.Control />
        </Form.Group>
    <div class="align-self-end">
    <Button disabled onClick={onClaimZugPressed}>Claim Zug</Button>
    </div>
      

    </div>
   
    </div>
  </div>        
  <Alert>{status}</Alert>
</div>

     



<Stake nftContract={nftContract} />


<div class="space-y-2 p-2 border-2">        
<h2>Look up Orc</h2>
<div class="flex flex-wrap justify-evenly">
  
  <div>

  <Form.Group onChange={handleOrcChange}>
      <Form.Label>Look up orc, type orc id here</Form.Label>
      <Form.Control />
    </Form.Group>
 

  </div>
 

<Orc nftContract={nftContract} tokenid={orcId} />

</div>
</div>



Credit:
<a target="_blank" href="https://hilarioushuskies.life" class="no-underline text-current">
<div class="sm:w-full lg:w-1/2 p-2">
          <div class="flex flex-wrap items-center">

              <div class="">
                  <div class="flex flex-wrap content-start">
                  <img class="shadow-lg rounded-3xl w-32" src={`https://huskies.s3.eu-west-2.amazonaws.com/images/logo.gif`} />
                  </div>
            </div>
            <div class="w-1/2 pl-3">
            <h1 class="text-5xl md:text-6xl xl:text-9xl font-bold ">Hilarious Huskies</h1>
            </div>
         
            </div> </div>
</a>
</div>



  );
}

export default App;


