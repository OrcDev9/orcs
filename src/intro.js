import React from "react";
import Title from "./Title";

const Intro = () => {
        

return (

<div class="flex flex-wrap justify-between">
<div>
                   <div class="text-xl"> <Title text={"TRAIN, FARM, AND PILLAGE"} /> </div> 
                    <p class="pt-2">EtherOrcs is a collection of 5050 Orcs ready to pillage the blockchain. With no IPFS or API, these Orcs are the very first role-playing game that takes place 100% on-chain. For the HORDE!</p>
                    <p>If its the first time you are using this app, connect your wallet.</p>
                    <p>Click on My Orcs to get started. Click to toggle select orcs, then make them do something. If nothing happens, refresh the page or reconnect your wallet.</p>
                     <p>If Orcs are missing from your Tavern, try looking them up in, <strong>"LOOK UP ORC"</strong></p>

</div>
</div>
      
               
  );
};

export default Intro;


