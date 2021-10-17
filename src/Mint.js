import ConnectWallet from "./ConnectWallet";
import {
  getCurrentWalletConnected, //import here
  mintNFT, getTokenSupply, getGasPrice, getEthPrice, isSaleActive, getContractPrice, tokensByOwner, getContract, getErc,
  
} from "./utils/interact.js";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import logo from "./media/logo.svg"
import { Alert } from "react-bootstrap";
import { Form } from "react-bootstrap";


function Mint() {


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

 useEffect(async () => {


   const {address, status} = await getCurrentWalletConnected();
   setWallet(address)
   setStatus(status);
   addWalletListener(); 



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
 
await nftContract.methods.claim([1]).call()
   
  
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
<div>
         

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
    <Button onClick={onClaimZugPressed}>Claim Zug</Button>
    </div>
      

    </div>
   
    </div>
  </div>        
  <Alert>{status}</Alert>

     

  </div></div>


  );
}

export default Mint;


