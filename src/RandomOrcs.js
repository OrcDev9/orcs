import React, { useState, useEffect } from "react";
import Orc from "./Orc";
import Title from "./Title";
import {
 lookupMultipleOrcs
  } from "./utils/interact.js";

const RandomOrcs = () => {

const [myOrcs, setMyorcs] = useState();
  
useEffect(async () => {
  let arry = Array.from({length: 12}, () => Math.floor(Math.random() * 5050));
  let multiOrcs = await lookupMultipleOrcs({array: arry})
  setMyorcs(multiOrcs)
  
  },[0])
  
  
return (

<>  
<div class="text-3xl"><Title text={"SOME RANDOM ORCS"} /></div>  
              
              <div class="flex flex-wrap">
  
                {myOrcs && myOrcs.map((orc, index)=>{
                    let classes = "hover:bg-yellow-800"
                
                    return(
                    <div key={orc.name} class={`w-1/2 md:w-1/4 pointer-events-auto ${classes}`}>
                    <Orc format={"figure"} key={orc.tokenid} orc={orc} />
                    </div>
                    )
                })}
                </div> 
</>)}

export default RandomOrcs;


