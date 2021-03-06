import React, { useState, useEffect } from "react";
import {getMyOrcsObject, authToken} from "./utils/services"
import Orc from "./Orc";
import {doAction, collectZug, getCurrentWalletConnected, mintNFT, lookupMultipleOrcs , getContract, lookupOrc} from "./utils/interact.js";
import Pillage from "./Pillage";
import Title from "./Title";
import { db } from "./initFirebase";
import { getDatabase, ref, set, onValue, query, get,child, equalTo, orderByValue, push, orderByChild, limitToLast} from "firebase/database";
import Battle from "./Battle";
import Chat from "./orcChat";

const MyOrcs = () => {

const [myOrcs, setMyOrcs] = useState();
const [myOrcsArr, setMyOrcsArr] = useState({orcs: [], isLoading:true});
const [showPillage, setShowPillage] = useState(false);
const [clicked, setClicked] = useState([]);
const [status, setStatus] = useState();
const [welcome, setWelcome] = useState();
const [claimableZug, setClaimableZug] = useState();
const [claimtoggle, setClaimtoggle] = useState(true);
const [displayOrcs, setDisplayOrcs] = useState(true);
const [loadChat, setLoadChat] = useState(false);
const [numberofOrcs, setNumberofOrcs] = useState(0);

const [walletAddress, setWallet] = useState("");




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
let puck = "0xa8fbe0452eedfc4598d4c64c33615d942a70af6e"
let saint = "0x0e95ee3a584d95ce952f31b042ac0d5237644431"
let testAuth = "0xb55eb9bd32d6ab75d7555192e7a3a7ca0bcd5738"
let steven = "0x310Bf09575a8F66b92BcF9dd0668430Fd7104cF4"


const welcomeFunction = (address) => {

  if (address.toLowerCase() === testAuth){
    let message = authToken();
    message = atob(message);
    setWelcome(message)
  }  
}


const updateOrcsDb = async (obj) => {
 
  const db = getDatabase();
  const timestamp = Date.now()
  const userDataRef = ref(db, `etherorcs/address/${obj.address}/tokens/` + obj.token)
  
  await set(userDataRef, {
    lastSeen: timestamp,
  });
}


const summonOrcs = async (address) => { //TODO: implement
  welcomeFunction(address) 
  const myOrcQuery = query(ref(db, 'etherorcs/orcs/'), orderByChild('owner'), equalTo(address.toLowerCase())) ///"0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"));

  let dataArry = []
  let tokenArr = []

onValue(myOrcQuery, (snapshot)=>{

      if(snapshot.exists()){        

        Object.entries(snapshot.val()).forEach(([key, value])=>{  
        dataArry.push({tokenId:value.tokenid, claimable:value.claimable, action:value.action})         
        tokenArr.push(value.tokenid)
        updateOrcsDb({token: value.tokenid, address: address})   

        })

  setStatus(`Found ${tokenArr.length} Orc(s) for ${address}... Loading!`);
  setNumberofOrcs(tokenArr.length)
  setMyOrcs({orcs: dataArry, tokens:tokenArr})
  console.log("Found Orcs. Orc of them", address, dataArry, "Orcs held:", tokenArr)   

}else{
  setStatus(`Found no Orcs try looking them up to force a metadata refresh.`);
  console.log("Got No Orcs. NOrc of them", address) 
}
      
      },{onlyOnce: true})

   
}

useEffect(async () => {

  const {address, status} = await getCurrentWalletConnected();
  setWallet(address)
  setStatus(status);
  if(displayOrcs)
  {
    await summonOrcs(address)
  }
  
 
},[])


useEffect(async () => {
  if(myOrcs){
    if(myOrcs.tokens.length > 0){
      let multiOrcs = await lookupMultipleOrcs({array: myOrcs.tokens})
      setMyOrcsArr({orcs:multiOrcs, isLoading:false})
    } 
  }

},[myOrcs])







const toggle = index => {
  setStatus(`Orc# ${index} clicked`);
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
                setLoadChat(false)
                setShowPillage(false)
               
            }

}

const doActionClick = async (actionIndex) => { //TODO: implement
  setStatus("") 


    if(clicked.length > 1){
      setStatus(`Orcs are about to farm or train`);
        const {success, status} = await doAction(actionIndex, clicked)
        setStatus(status);
    }else if(clicked.length === 1){
      setStatus(`One Orc are about to farm or train`);
        let temp = clicked[0]
        const {success, status} = await doAction(actionIndex, temp)
        setStatus(status);
    }else{
        setStatus("No Orcs selected")
    }

};


const onMintPressed = async (event) => { //TODO: implement
 
     const { status, txHash, success } = await mintNFT();
     setStatus(status);    
 
   };

   const onDisplayOrcsPressed = async (event) => { //TODO: implement
    setDisplayOrcs(!displayOrcs)

  };

 
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

        setStatus(`Claimable $ZUG is ${claim.toFixed(2)}`)

    }else{
      myOrcs.orcs.map((orc)=>{
        if(orc.claimable > 0){
         
            claimArr.push(orc.tokenId)
        }
    })
      setStatus(`$ZUG being claimed for Orcs`)
        const { status, txHash, success } = await collectZug(claimArr) 
        setStatus(status)
        console.log("$ZUG being claimed for:", claimArr) 
        
        setClaimtoggle(!claimtoggle)
    }
   
    
    
     };
    
     

return (
               
<>
<div>
{welcome &&
  <div class="border-2 p-2 m-3">{welcome}</div>
}


<div class="text-3xl pb-2">
<Title text={"ACTIONS"} />
</div>
            <div class="flex flex-wrap justify-between pb-3">

            <button onClick={onDisplayOrcsPressed}>Refresh</button>

            <button onClick={onClaimZugPressed}>
                        {claimtoggle ? ("Calculate $ZUG owed!") : "Claim $ZUG!"}</button>

            </div>

            <div class="flex flex-wrap justify-left gap-4 pb-3">

            {showPillage && (
              <>
                <Pillage wallet={walletAddress} orcs={myOrcsArr.orcs} tokenid={clicked[0]} />
          
                <Battle wallet={walletAddress} orcs={myOrcsArr.orcs} tokenid={clicked[0]} />  
               <button onClick={()=>{setLoadChat(!loadChat)}}>
               {!loadChat ? "Load Orc Chat" : "Close Orc Chat" }
               </button>

              </>)}
              </div>
              <div class="flex flex-wrap justify-left gap-4">
            <button variant="dark" onClick={()=>doActionClick(2)}>
              Train!
            </button>
            <button variant="dark" onClick={()=>doActionClick(1)}>
              Farm!
            </button>
            <button variant="dark" onClick={()=>doActionClick(0)}>
              Unstake
            </button>

            </div>
      

            <div class="border-2 p-2 m-3"><strong class="font-serif">OrcBot says: {" "}</strong>{status}</div>
{/*
<div class="flex flex-wrap">
<p>family potrait</p>

{!myOrcsArr.isLoading && displayOrcs && myOrcsArr.orcs.map((obj)=>{
  let classes = "border-white border-2 hover:bg-yellow-500"
  let rows = numberofOrcs/3
  if(clicked.includes(parseInt(obj.tokenid))){
      classes="border-2 bg-grey bg-yellow-600"
  }
return(
  <div key={obj.name} class={`w-12`} >
    <Orc format={"image"} key={obj.name} orc={obj} />
    </div>
  
)})}


</div>

*/}


<div class="flex flex-wrap">


{!myOrcsArr.isLoading && displayOrcs && myOrcsArr.orcs.map((obj)=>{
  let classes = "hover:bg-yellow-500"
  if(clicked.includes(parseInt(obj.tokenid))){
      classes="bg-yellow-600"
  }
return(
  <div key={obj.name} class={`w-1/2 md:w-32 pointer-events-auto p-1 m-2 ${classes}`} onClick={()=> toggle(parseInt(obj.tokenid))}>
    <Orc format={"figure"} key={obj.name} orc={obj} />
    </div>
  
)})}


</div>

<div class="p-3">

{loadChat && (
<>
<div class="text-3xl pb-2">
<Title text={"MESSAGE BOARD"} />
</div>
<Chat orcs={myOrcsArr.orcs} tokenid={clicked[0]} wallet={walletAddress} />
</>
)}

</div>
</div>

    </>
  );
};

export default MyOrcs;


