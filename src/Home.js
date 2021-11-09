import { useState, useEffect, useRef } from "react";
import { Tab } from "react-bootstrap";
import { Tabs } from "react-bootstrap";
import MyOrcs from "./myOrc";
import Intro from "./intro"
import ConnectWallet from "./ConnectWallet"
import Resources from "./Resources.js";
import RandomOrcs from "./RandomOrcs.js";
import OrcGods from "./OrcGods.js";
import LookupOrc from "./LookupOrc.js";
import OrcPFP from "./OrcPfp.js";
import logo from "./media/newlogo.png"


function App() {

//setZug((await ercContract.methods.balanceOf(address).call()))

const [showOrc, setShowOrc] = useState(true);
const [orcId, setOrcId] = useState([1]);

const orcLookupRef = useRef(1);



const handleOrcSubmit = (e) => {
  e.preventDefault()
  const value = orcLookupRef.current.value;
  const t = parseInt(value)


  if((t > 0) && (t < 5050)){

    setOrcId(value);
  }
setShowOrc(true)

    
};


return (
    
<div class="container mx-auto space-y-5">
            
                 <div class="flex justify-center align-items-baseline">
                        <img src={logo} alt="EtherOrcs Tavern" />
                  </div> 

 
<div class="space-y-2 p-2">     

<div class="flex justify-end">
      <ConnectWallet />
</div> 

<div class="space-y-6">
<Intro />
<MyOrcs />
<LookupOrc />  
<RandomOrcs />
<OrcGods />
<Resources />


</div>
                           

              
</div> 
</div>





  );
}

export default App;



