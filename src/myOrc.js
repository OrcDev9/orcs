import React, { useState, useEffect } from "react";
import {getMyOrcsObject} from "./utils/services"
import Orc from "./Orc";
import {doAction, collectZug, getCurrentWalletConnected, mintNFT, lookupAllOrcs, getContract, lookupOrc} from "./utils/interact.js";
import Pillage from "./Pillage";
import Title from "./Title";
import { db } from "./initFirebase";
import { getDatabase, ref, set, onValue, query, get,child, equalTo, orderByValue, push, orderByChild, limitToLast} from "firebase/database";

const MyOrcs = () => {

const [myOrcs, setMyOrcs] = useState();
const [myOrcsArr, setMyOrcsArr] = useState([]);
const [showPillage, setShowPillage] = useState(false);
const [clicked, setClicked] = useState([]);
const [status, setStatus] = useState();
const [claimableZug, setClaimableZug] = useState();
const [claimtoggle, setClaimtoggle] = useState(true);
const [displayOrcs, setDisplayOrcs] = useState(true);

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



const updateOrcsDb = async (obj) => {
 
  const db = getDatabase();
  const timestamp = Date.now()
  const userDataRef = ref(db, `etherorcs/address/${obj.address}/tokens/` + obj.token)
  
  await set(userDataRef, {
    lastSeen: timestamp,
  });
}


const summonOrcs = async (address) => { //TODO: implement
    
  const myOrcQuery = query(ref(db, 'etherorcs/orcs/'), orderByChild('owner'), equalTo(address.toLowerCase())) ///"0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"));
  console.log("2.", address, "3.", myOrcQuery)    
  let dataArry = []
  let tokenArr = []
  let OrcObjArr = []

onValue(myOrcQuery, (snapshot)=>{
  console.log("4.", snapshot.val())
      if(snapshot.exists()){        

        Object.entries(snapshot.val()).forEach(([key, value])=>{
  
        dataArry.push({tokenId:value.tokenid, claimable:value.claimable, action:value.action})         
        tokenArr.push(value.tokenid)
        updateOrcsDb({token: value.tokenid, address: address})   
        //OrcObjArr.push(lookupOrc(value.tokenid))  orcObj: OrcObjArr 
        })

  setStatus(`Found ${tokenArr.length} Orc(s) for ${address}... Loading!`);
  setMyOrcs({orcs: dataArry, tokens:tokenArr})
  console.log("Found Orcs. Orc of them", address, dataArry, "Orcs held:", tokenArr)   

}else{
  setStatus(`Found no Orcs try looking them up to force a metadata refresh.`);
  console.log("Got No Orcs. NOrc of them", address) 
}
      
      },{onlyOnce: true})

/*const myOrcsData = await getMyOrcsObject(claimwallet.toLowerCase())
setMyOrcs(myOrcsData)
console.log("1. address being fed to orc finder", address.toLowerCase())
setStatus(myOrcsData.status[0]) 

const array = myOrcsData.tokens
let allOrcs = lookupAllOrcs({array})
console.log("who let dogs out:,", allOrcs)
*/
}

useEffect(async () => {

  const {address, status} = await getCurrentWalletConnected();
  setWallet(address)
  setStatus(status);
  
  if(displayOrcs){summonOrcs(address)}
 
},[displayOrcs])

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
                setShowPillage(false)
               
            }

}


const doActionClick = async (actionIndex) => { //TODO: implement
  setStatus("") 

  console.log(clicked)

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

   

  
///console.log(myOrcs)
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
    
     console.log(myOrcs)

        

return (
               
<>

<div class="text-xl pb-2">
<Title text={"ACTIONS"} />
</div>
            <div class="flex flex-wrap justify-between">

            <button onClick={onDisplayOrcsPressed}>Refresh</button>

            <button onClick={onClaimZugPressed}>
                        {claimtoggle ? ("Calculate $ZUG owed!") : "Claim $ZUG!"}</button>

            {showPillage ? (
                <Pillage wallet={walletAddress} orc={null} tokenid={clicked[0]} />
            ) : ( <button>Pillage</button> )}

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

<div class="flex flex-wrap">

{myOrcs && displayOrcs && myOrcs.orcs.map((orc, index)=>{
    let classes = "border-white border-2 hover:bg-yellow-500"
    if(clicked.includes(parseInt(orc.tokenId))){
        classes="border-2 bg-grey bg-yellow-600"
    }
    return(
    <div key={orc.name} class={`w-1/2 md:w-1/4 pointer-events-auto ${classes}`} onClick={()=> toggle(parseInt(orc.tokenId))}>
    <Orc allData={false} key={orc.name} tokenid={parseInt(orc.tokenId)} />
    </div>
    )
})}
</div>


    </>
  );
};

export default MyOrcs;


