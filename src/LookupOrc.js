import {
lookupMultipleOrcs
    } from "./utils/interact.js";
    import { useState, useEffect, useRef } from "react";
    import Orc from "./Orc"
    import Title from "./Title.js";
import OrcPFP from "./OrcPfp.js";
    
    function LookupOrc() {
    
    //setZug((await ercContract.methods.balanceOf(address).call()))
    const [myOrcs, setMyorcs] = useState();    
    const [showOrc, setShowOrc] = useState(false);
    const [orcId, setOrcId] = useState();
    
    const orcLookupRef = useRef();
    
   
    const handleOrcSubmit = async (e) => {
      
      e.preventDefault()
      setShowOrc(false)
      const value = orcLookupRef.current.value;
      const t = parseInt(value) 
      let tempArr = [] 
      tempArr.push(t) 
    
      if((t > 0) && (t < 5051)){
        let multiOrcs = await lookupMultipleOrcs({array: tempArr})
        console.log(multiOrcs, tempArr)
        setMyorcs(multiOrcs)
        setShowOrc(true)        

      }   
        
    };
    
    
    return (
        <>
    <div class="text-3xl"> <Title text={"LOOK UP ORCS"}/></div>  
    <div class="flex flex-wrap">

        <div class="md:w-1/3">
       
                       <div class="flex flex-wrap">
                            <form onSubmit={handleOrcSubmit}>
                         <input  placeholder={"Type Orc Id here"} ref={orcLookupRef} />
                         <button class="hidden" type="submit">Unleash the Orc</button> 
                         </form>    
                       </div>  
                   {showOrc && <Orc format={"card"} orc={myOrcs[0]} />}
                   
        </div>

        <div class="md: w-2/3">
        {showOrc && <OrcPFP orc={myOrcs[0]}/>}
        </div>

        
        
                      

        </div>
    </>
      );
    }
    
    export default LookupOrc;
    
    
    
    