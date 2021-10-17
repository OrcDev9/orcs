import React, { useState, useEffect } from "react";
import {getMyOrcsObject} from "./utils/services"
import Orc from "./Orc";
import { Button } from "react-bootstrap";
import {doAction } from "./utils/interact.js";
import Pillage from "./Pillage";

const MyOrcs = ({address}) => {

const [myOrcs, setMyOrcs] = useState();
const [showPillage, setShowPillage] = useState(true);
const [clicked, setClicked] = useState([]);
const [status, setStatus] = useState(null);

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


console.log(clicked)
console.log(showPillage)




useEffect(async () => {

setMyOrcs(await getMyOrcsObject(address))

}, [address]);

return (
    <div class="border-2 p-3">
{status}
<h2>EtherOrcs Tavern</h2>
<h3 class="bold">TRAIN, FARM AND PILLAGE</h3>
<p>Click to toggle select orcs.</p>
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


</div>

<div class="flex flex-wrap">

{myOrcs && myOrcs.map((orc, index)=>{
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
