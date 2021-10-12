import ConnectWallet from "./ConnectWallet";
import {
  getCurrentWalletConnected, //import here
  mintNFT, getTokenSupply, getGasPrice, getEthPrice, isSaleActive, getContractPrice, tokensByOwner, getContract, getErc
} from "./utils/interact.js";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {app, analytics} from "./initFirebase"
import logo from "./media/logo.svg"
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

const places = [{ "places": ["TOWN", "DUNGEON", "CRYPT", "CASTLE", "DRAGONS_LAIR", "THE_ETHER", 
  "TAINTED_KINGDOM", "OOZING_DEN", "ANCIENT_CHAMBER", "ORC_GODS"] }]
 
  const actions = [{"farm" : 1,
                    "train" : 2,
                    "unstake" : 0   
                      }]

                      const wallet1 = "0x3edc863789a36f508340ea3f2aa40674139cf5b6"
                      const wallet2 = "0x80e09203480a49f3cf30a4714246f7af622ba470"
                      const wallet3 = "0xb3fab8bdf13d493f64e63c2849b0da224994fa76"
                      

 useEffect(async () => {
  


   const {address, status} = await getCurrentWalletConnected();
   setWallet(address)
   setStatus(status);
   addWalletListener(); 


   
  setTokenSupply(await nftContract.methods.totalSupply().call());
  setZug(web3.utils.fromWei(await ercContract.methods.balanceOf(wallet3).call()))

  const orcProp = await nftContract.methods.orcs(2).call(34)
  console.log(await nftContract.methods.activities(2).call());
  console.log(orcProp)



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
  <div class="flex justify-left align-items-center">
  <img class="rounded-full" width={100} src={logo} alt="Orcs Logo" />
  <h1 class="text-5xl md:text-6xl xl:text-9xl font-bold">Ether Orcs</h1>

  </div>
<p class="text-lg font-medium">Front end concept by Husky Studios, creators of Hilarious Huskies</p>

<ConnectWallet />
Token Supply: {tokenSupply}

<br/>
gasPrice {gasPrice} <br/>
ethprice {ethprice}  <br/>
zug {zug} <br/>

<MintButtonLogic />


</div>


  );
}

export default App;


