import React, { useState, useEffect } from "react";
import Orc from "./Orc";
import Title from "./Title";
import {
 lookupMultipleOrcs
  } from "./utils/interact.js";

const OrcGods = () => {

const [myOrcs, setMyorcs] = useState();
  
useEffect(async () => {
  let arry = [460, 1054, 1148, 1396, 1026, 453, 136,154, 728,172,746,745]
  let multiOrcs = await lookupMultipleOrcs({array: arry})
  setMyorcs(multiOrcs)
  
  },[0])
  
  
return (

<>  
<div class="text-3xl"><Title text={"ORC GODS"} /></div>  
              
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

export default OrcGods;


