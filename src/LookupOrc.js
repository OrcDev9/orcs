import {
    getGasPrice, getEthPrice, getContract, getContractEvents, lookupAllOrcs, lookupMultipleOrcs
    } from "./utils/interact.js";
    import { useState, useEffect, useRef } from "react";
    import Orc from "./Orc"
    import Title from "./Title.js";
    
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

        <div class="w-1/3">
       
                       <div class="flex flex-wrap justify-center">
                            <form onSubmit={handleOrcSubmit}>
                         <input  placeholder={"Type Orc Id here"} ref={orcLookupRef} />
                         <button class="hidden" type="submit">Unleash the Orc</button> 
                         </form>    
                       </div>  
                   {showOrc && <Orc format={"card"} orc={myOrcs[0]} />}
                   
        </div>

        <div class="w-2/3">
        <div>
        {showOrc && <Orc format={"poofparts"} orc={myOrcs[0]} />}
        </div>
        <div class="flex flex-wrap justify-center">
        
        <div class="w-1/2">
        {showOrc && <Orc format={"pfp"} orc={myOrcs[0]} />}
        </div>

       <div class="w-1/2">
        {showOrc && <Orc format={"image"} orc={myOrcs[0]} />}
        </div>

    
        </div>

        


        </div>

        
        
                      

        </div>
    </>
      );
    }
    
    export default LookupOrc;
    
    
    
    