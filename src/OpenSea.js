import {
    getContractEvents, getContract
  } from "./utils/interact.js";
  import { useState, useEffect, useRef } from "react";
  import { Button } from "react-bootstrap";
  import Orc from "./Orc";

  
  function OpenSea() {
  
  const [osEvents, setOSEvents] = useState("");
  const [isMetamask, setIsMetamask] = useState(true);
  const [gasPrice, setGasPrice] = useState(0);
  const [showOrc, setShowOrc] = useState(true);
  const [orcId, setOrcId] = useState(1);
  
  
  useEffect(async () => {
  
    let osData = await getContractEvents()
    setOSEvents(osData)
  
  },[])
  
  
  
  
  
    return (
        <>

        {osEvents && osEvents.map((event)=>{
console.log(event)
return(<>{event.user.username}

{event.event_type}

{event.starting_price}

{event.starting_price}
</>)
        })}
  
  
  </>
    );
  }
  
  export default OpenSea;
  
  
  

