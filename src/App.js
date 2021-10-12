import ConnectWallet from "./ConnectWallet";
import {
  getCurrentWalletConnected, //import here
  mintNFT, getTokenSupply, getGasPrice, getEthPrice, isSaleActive, getContractPrice, tokensByOwner, getContract,
} from "./utils/interact.js";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {app, analytics} from "./initFirebase"

function App() {
  // Define the string
var encodedStringAtoB = 'SGVsbG8gV29ybGQh';

// Decode the String
var decodedStringAtoB = atob(encodedStringAtoB);

const analytics
const nftContract = getContract()

const [qty, setQty] = useState(0);
const [walletAddress, setWallet] = useState("");
const [status, setStatus] = useState("");
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
const [showCollectionToggle, setShowCollectionToggle] = useState(false);


 

 useEffect(async () => {
  
   const {address, status} = await getCurrentWalletConnected();
   setWallet(address)
   setStatus(status);
   addWalletListener(); 

   
  setTokenSupply(await nftContract.methods.totalSupply().call());
  console.log(await nftContract.methods.activities(2).call());



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
 


 const onMintPressed = async (event) => { //TODO: implement
   if(!activeSale){
     setStatus("Minting not open yet. Come back on the 15th of October")
     return
   }
   if(qty > 0){
     setStatus()
   event.preventDefault();

   setTxProgress(33)
  
   const { status, txHash, success } = await mintNFT(qty);
   setStatus(status);
   
   ///check for successful transaction
     if(success ===true){
         setTxProgress(100)
          
       }else{
         setTxProgress(0)
        
       }
     }
     else{
       setStatus("Quantity must be greater than zero")
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

 function ShowCollection(props) {    

   if(collections.length > 0)
   return (
     walletAddress && (<Button variant="success" onClick={()=>setShowCollectionToggle(!showCollectionToggle)}>
     {showCollectionToggle ? ("Close") : ("Show My Huskies")}
    </Button> ) 
       
   )
   else
   return(
           
     <Button variant="dark" disabled>
      You don't have any huskies yet.
   </Button>
   )
 }





  return (
<div class="container mx-auto">
<h1 class="text-5xl md:text-6xl xl:text-9xl font-bold">Ether Orcs</h1>
<ConnectWallet />
Token Supply: {tokenSupply}

<br/>
gasPrice {gasPrice} <br/>
ethprice {ethprice}
</div>
  );
}

export default App;
