import React, { useState, useEffect } from "react";
import {getMyOrcsObject} from "./utils/services"
import Orc from "./Orc";
import { Button } from "react-bootstrap";
import {doAction, collectZug, getCurrentWalletConnected, mintNFT, lookupAllOrcs} from "./utils/interact.js";
import Pillage from "./Pillage";
import ConnectWallet from "./ConnectWallet";
import logo from "./media/logo.svg"
import { db } from "./initFirebase";

const MyOrcs = () => {

const [myOrcs, setMyOrcs] = useState();
const [showPillage, setShowPillage] = useState(false);
const [clicked, setClicked] = useState([]);
const [status, setStatus] = useState(null);
const [claimableZug, setClaimableZug] = useState();
const [claimtoggle, setClaimtoggle] = useState(true);
const [orcTokens, setOrcTokens] = useState([]);
const [walletAddress, setWallet] = useState("");

const [isMetamask, setIsMetamask] = useState(true);


///test Wallets
const wallet4 = "0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"
const tempAddress = "0x3FE61420C33b0E41DDd763adaAeB0b638E78b768"
let wallet2 = "0x5f6810da9379d650676a4452f3415ce743fefe14"
let walletballer = "0xf84f2f86be594dCcCd4c192Ab8058f9F73fB25e7"
let bet = "0xf623A49eBE67CeFea751f0Fc63c8AE863e251052"
let sid = "0xCcB6D1e4ACec2373077Cb4A6151b1506F873a1a5"
let wrangler = "0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"
let another = "0xd23c8be03abb97f6885016b3e96de48c600d06e3"
let a = "0x430d192e0EA959c7BB6B26eD6534B55B187b487A"
let claimwallet = "0xfcdbada91ca1aaa80efbe3b62102863d32a2fed4"
const ethWallet = "0x7d9d3659dcfbea08a87777c52020bc672deece13"


useEffect(async () => {

    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);
    addWalletListener(); 
    
    const myOrcsData = await getMyOrcsObject(address.toLowerCase())
    setMyOrcs(myOrcsData)
    console.log("address being fed to orc finder", address.toLowerCase())
    const array = myOrcsData.tokens
    let allOrcs = lookupAllOrcs({array})
    console.log("who let dogs out:,", allOrcs)
   
},[])



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


const toggle = index => {
          
            let newArr = []
         
                    if(clicked.includes(index)){
                        clicked.map((a)=>{
                            if(a===index){
                                return(null)
                            }else{
                                newArr.push(a)
                            }
                      })
                    }else{
                        newArr.push(index)
                        clicked.map((a, i)=>{
                            
                                newArr.push(a)
                        })
                    }
      
              setClicked(newArr)
              if(newArr.length > 1 ){
                  setShowPillage(false)
              }
              if(newArr.length === 1 ){
                setShowPillage(true)
            }
            if(newArr.length === 0 ){
                setShowPillage(false)
            }

}


const doActionClick = async (actionIndex) => { //TODO: implement

    if(clicked.length > 1){

        const {success, status} = await doAction(actionIndex, clicked)
        setStatus(status);
    }else if(clicked.length === 1){
      
        let temp = clicked[0]
        const {success, status} = await doAction(actionIndex, temp)
        setStatus(status);
    }else{
        setStatus("empty fields somewhere")
    }

  
    /*
    setTxProgress(33)
     const { status, txHash, success } = await mintNFT(qty);
     setStatus(status);
     
     ///check for successful transaction
       if(success ===true){
           setTxProgress(100)
            
         }else{
           setTxProgress(0)
        
  
       }*/

};


const onMintPressed = async (event) => { //TODO: implement
 
     const { status, txHash, success } = await mintNFT();
     setStatus(status);
     
 
   };


   const summonOrcs = async (event) => { //TODO: implement
 
    const myOrcsData = await getMyOrcsObject(walletAddress.toLowerCase())
    setMyOrcs(myOrcsData)
    console.log("address being fed to orc finder", walletAddress.toLowerCase())
    setStatus("Orcs Summoned!")

    const array = myOrcsData.tokens
    let allOrcs = lookupAllOrcs({array})
    console.log("who let dogs out:,", allOrcs)
        

  };

//console.log(clicked)
//console.log(showPillage)

const onClaimZugPressed = async (event) => { //TODO: implement
    setClaimtoggle(!claimtoggle)
    let claim = 0   
    let claimArr = []
    if(claimtoggle){

       
        myOrcs.orcs.map((orc)=>{
            if(orc.claimable > 0){
                let number = parseFloat(orc.claimable)/Math.pow(10, 18)
                claim = claim + number
             //   console.log(claim, "cleam")
                setClaimableZug(claim.toFixed(2))
                claimArr.push(orc.tokenId)
            }
        })

    }else{
      myOrcs.orcs.map((orc)=>{
        if(orc.claimable > 0){
         
            claimArr.push(orc.tokenId)
        }
    })
        const { status, txHash, success } = await collectZug(claimArr) 
        console.log("zug being claimed for:", claimArr) 
        setClaimtoggle(!claimtoggle)
    }
   
    
    
     };
    

        

return (
    <div class="border-2 p-3">


<div class="flex flex-wrap justify-between">

                <div>
                        <div class="flex justify-left align-items-baseline">
                    <h1 class="text-5xl md:text-6xl xl:text-7xl font-bold font-serif pr-2 ">Ether</h1>
                    <img class="rounded-full" width={70} src={logo} alt="Orcs Logo" />
                    <h1 class="text-5xl md:text-6xl xl:text-7xl font-bold font-serif ">rcs Tavern</h1>
                </div> 
 
                <h3 class="bold">TRAIN, FARM AND PILLAGE</h3>
                <p>Click on Summon the Orcs first! Click to toggle select orcs, then make them do something. If nothing happens, refresh the page.</p>
                <div class="font-medium text-xl">Claimable $Zug: {claimableZug}</div>
                <div class="py-3 flex flex-wrap space-x-4">
                <Button onClick={summonOrcs}>Summon the Orcs!</Button>

                <Button onClick={onClaimZugPressed}>
                        {claimtoggle ? ("Calaculate $Zug owed!") : "Claim $Zug!"}

                </Button>
                <Button onClick={onMintPressed}>Mint!</Button>
                </div>



</div>
<div class="align-self-center">
                        <ConnectWallet />
                </div>

    </div>
<div class="flex flex-wrap justify-between">
{showPillage ? (
    <Pillage tokenid={clicked[0]} />
 ) : (  <Button variant="dark" disabled>
       Pillage with selected Orc!
    </Button>)}

<Button variant="dark" onClick={()=>doActionClick(2)}>
  Train selected Orcs & Level Up!
</Button>
<Button variant="dark" onClick={()=>doActionClick(1)}>
  Farm with selected Orcs & Earn Zug!
</Button>
<Button variant="dark" onClick={()=>doActionClick(0)}>
  Unstake
</Button>

<div>
{status}
</div>
</div>

<div class="flex flex-wrap">

{myOrcs && myOrcs.orcs.map((orc, index)=>{
    let classes = "border-white border-2 hover:bg-gray-100"
    if(clicked.includes(parseInt(orc.tokenId))){
        classes="border-2 bg-grey bg-gray-300"
    }
    return(
    <div key={orc.name} class={`w-1/2 md:w-1/4 pointer-events-auto ${classes}`} onClick={()=> toggle(parseInt(orc.tokenId))}>
    <Orc allData={false} key={orc.name} tokenid={parseInt(orc.tokenId)} />
    </div>
    )
})}
</div>
    </div>
  );
};

export default MyOrcs;
