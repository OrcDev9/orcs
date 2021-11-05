import {
getGasPrice, getEthPrice, getContract, getContractEvents, lookupAllOrcs, lookupMultipleOrcs
} from "./utils/interact.js";
import { useState, useEffect, useRef } from "react";
import Orc from "./Orc"
import { Tab } from "react-bootstrap";
import { Tabs } from "react-bootstrap";
import MyOrcs from "./myOrc";
import Intro from "./intro"
import Title from "./Title.js";
import ConnectWallet from "./ConnectWallet"
import Resources from "./Resources.js";
import RandomOrcs from "./RandomOrcs.js";
import OrcGods from "./OrcGods.js";
import LookupOrc from "./LookupOrc.js";
import OrcPFP from "./OrcPfp.js";

function App() {

//setZug((await ercContract.methods.balanceOf(address).call()))
const [myOrcs, setMyorcs] = useState();

const [showOrc, setShowOrc] = useState(true);
const [orcId, setOrcId] = useState([1]);

const orcLookupRef = useRef(1);

useEffect(async () => {
let arry = Array.from({length: 12}, () => Math.floor(Math.random() * 5050));
let multiOrcs = await lookupMultipleOrcs({array: arry})
setMyorcs(multiOrcs)

},[0])

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
                        <img src={"https://etherorcs.com/static/media/etherorcs-logo.d8a3762c.png"} alt="EtherOrcs Tavern" />
                  </div> 
 
<div class="space-y-2 p-2">     

<div class="flex justify-end">
                        <ConnectWallet />
                        </div> 
         
              <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                
              <Tab eventKey="home" title="Start Here">
              <Intro />
              </Tab>
              <Tab eventKey="myorcs" title="My Orcs">
              <MyOrcs />
              </Tab>

              <Tab eventKey="orcslookup" title="Look Up Orc">
               <LookupOrc />
                    </Tab>
                    <Tab eventKey="pfp" title="Create my pfp">
                    <OrcPFP />
                    </Tab>
 
  <Tab eventKey="random" title="Random Orcs">
  <RandomOrcs />
  </Tab>
  <Tab eventKey="god" title="Orc Gods">
  <OrcGods />
  </Tab>
  <Tab eventKey="os" title="Open Sea" disabled>
   {/*<OpenSea />*/ } 
  </Tab>
<Tab eventKey="resources" title="Resources">
<Resources />
  </Tab>





</Tabs>
             
              




                

              
              </div> 
      


   

<p class="font-medium"> Frontend concept by Husky Studios, creators of <a target="_blank" href="https://hilarioushuskies.life">Hilarious Huskies</a>. Support the creator by getting yours <a target="_blank" href="https://hilarioushuskies.life/mint">now!</a></p>



</div>





  );
}

export default App;



