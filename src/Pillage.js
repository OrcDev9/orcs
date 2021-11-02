import {pillage} from "./utils/interact.js";
import { useState, useEffect, useRef } from "react";
import town from "./media/images/Town.png"
import dungeon from "./media/images/Dungeon.png"
import crypt from "./media/images/crypt1.png"
import castle from "./media/images/Castle.png"
import dragon from "./media/images/dragosl.png"
import ether from "./media/images/ether2.png"
import kingdom from "./media/images/taintedkingdom1.jpg"
import den from "./media/images/oozingden.jpg"
import chamber from "./media/images/ancientchamber.png"
import gods from "./media/images/orcsgods.png"
import cavern from "./media/images/cavern.png"
import Modal from 'react-bootstrap/Modal'
import Orc from "./Orc";
import { getDatabase, ref, set, onValue, query, get,child, equalTo, orderByValue, push, orderByChild, limitToLast} from "firebase/database";
import Title from "./Title.js";


const places = [
    {place: "TOWN", level:1, image:town, index:0},
    {place: "DUNGEON", level:3, image:dungeon, index:1},
    {place: "THE CAVERN", level:10, cost: 120, image:cavern, index:2},
 //   {place: "CRYPT", level:6, image:crypt, index:2},
 //   {place: "CASTLE", level:15, image:castle, index:3},
 //   {place: "DRAGON'S LAIR", level:25, image:dragon, index:4},
 //   {place: "THE ETHER", level:36, image:ether, index:5},
 //   {place: "TAINTED KINGDOM", level:15, image:kingdom, index:6},
 //   {place: "OOZING DEN", level:25, image:den, index:7},
 //   {place: "ANCIENT CHAMBER", level:45, image:chamber, index:8},
  //  {place: "ORC GODS", level:52, image:gods, index:9},
   ]

  /*
// Here's whats available in each place
        LootPool memory town           = LootPool({ minLevel: 1,  minLootTier:  1, cost:   0, total: 1000, tier_1: 800,  tier_2: 150,  tier_3: 50,  tier_4:   0 });
        LootPool memory dungeon        = LootPool({ minLevel: 3,  minLootTier:  2, cost:   0, total: 1000, tier_1: 800,  tier_2: 150,  tier_3: 50,  tier_4:   0 });
        LootPool memory crypt          = LootPool({ minLevel: 6,  minLootTier:  3, cost:   0, total: 2619, tier_1: 1459, tier_2: 1025, tier_3: 135, tier_4:   0 });
        LootPool memory castle         = LootPool({ minLevel: 15, minLootTier:  4, cost:   0, total: 6000, tier_1: 3300, tier_2: 2400, tier_3: 300, tier_4:   0 });
        LootPool memory dragonsLair    = LootPool({ minLevel: 25, minLootTier:  5, cost:   0, total: 6000, tier_1: 3300, tier_2: 2400, tier_3: 300, tier_4:   0 });
        LootPool memory theEther       = LootPool({ minLevel: 36, minLootTier:  6, cost:   0, total: 3000, tier_1: 1200, tier_2: 1500, tier_3: 300, tier_4:   0 });
        LootPool memory taintedKingdom = LootPool({ minLevel: 15, minLootTier:  4, cost:  50, total:  600, tier_1:  150, tier_2:  150, tier_3: 150, tier_4: 150 });
        LootPool memory oozingDen      = LootPool({ minLevel: 25, minLootTier:  5, cost:  50, total:  600, tier_1:  150, tier_2:  150, tier_3: 150, tier_4: 150 });
        LootPool memory ancientChamber = LootPool({ minLevel: 45, minLootTier:  9, cost: 125, total:  225, tier_1:  225, tier_2:    0, tier_3:   0, tier_4:   0 });
        LootPool memory orcGods        = LootPool({ minLevel: 52, minLootTier: 10, cost: 300, total:   12, tier_1:    0, tier_2:    0, tier_3:   0, tier_4:   0 });

        lootPools[Places.TOWN]            = town;
        lootPools[Places.DUNGEON]         = dungeon;
        lootPools[Places.CRYPT]           = crypt;
        lootPools[Places.CASTLE]          = castle;
        lootPools[Places.DRAGONS_LAIR]    = dragonsLair;
        lootPools[Places.THE_ETHER]       = theEther;
        lootPools[Places.TAINTED_KINGDOM] = taintedKingdom;
        lootPools[Places.OOZING_DEN]      = oozingDen;
        lootPools[Places.ANCIENT_CHAMBER] = ancientChamber;
        lootPools[Places.ORC_GODS]        = orcGods;
  */

  
//const places = [{ "places": ["TOWN", "DUNGEON", "CRYPT", "CASTLE", "DRAGONS_LAIR", "THE_ETHER", 
//  "TAINTED_KINGDOM", "OOZING_DEN", "ANCIENT_CHAMBER", "ORC_GODS"] }]


function Pillage({tokenid, wallet, orcs}) {

const [lootPool, setLootPool] = useState(0);
const [status, setStatus] = useState();
const [prompt, setPrompt] = useState();
const [modalShow, setModalShow] = useState(false);
const [toggleItemsShow, setToggleItemsShow] = useState(true);
const [togglePlaceShow, setTogglePlaceShow] = useState(false);
const [togglePillageShow, setTogglePillageShow] = useState(false);

const [checkedHelm, setCheckedHelm] = useState(false);
const [checkedMainhand, setCheckedMainhand] = useState(false);
const [checkedOffhand, setCheckedOffhand] = useState(false);
const [checkedAll, setCheckedAll] = useState(false);

const updatePillage = async (obj) => {
 
  const db = getDatabase();
  const timestamp = Date.now()
 
  const userDataRef = ref(db, `etherorcs/pillage/${obj.token}`)

await set(userDataRef, {
    lastPillage: timestamp,
   
  });

}

let OrcObjectoPass 

orcs.map((orc)=>{

  if(orc.tokenid === tokenid)
  OrcObjectoPass = orc

})


const handleChangeHelm = () => {
  setCheckedHelm(!checkedHelm);
};

const handleChangeMainhand = () => {
  setCheckedMainhand(!checkedMainhand);
};

const handleChangeOffhand = () => {
    setCheckedOffhand(!checkedOffhand);
  };

  const handleChangeAll = () => {
    setCheckedOffhand(!checkedOffhand);
    setCheckedMainhand(!checkedMainhand);
    setCheckedHelm(!checkedHelm);
  };


const Checkbox = ({ label, value, onChange }) => {
    return (
      <label class="font-bold text-sm">
        <input type="checkbox" checked={value} onChange={onChange} />
        {"   "}
        {label}
      </label>
    );
  };

  function LootItems() {

    return(<>
        <div class="p-2 my-1">  
        <div>
          <Title text={"Select item slots to pillage for..."} />
            
        </div>
        <div class="flex flex-wrap justify-between font-body my-3" >
                    <Checkbox
                        label="Helm"
                        value={checkedHelm}
                        onChange={handleChangeHelm}
                    />
                    <Checkbox
                        label="Mainhand"
                        value={checkedMainhand}
                        onChange={handleChangeMainhand}
                    />
                    <Checkbox
                        label="Offhand"
                        value={checkedOffhand}
                        onChange={handleChangeOffhand}
                    />
                       <Checkbox
                        label="Select All"
                        value={checkedAll}
                        onChange={handleChangeAll}
                    />
             </div>
             {prompt && (
               <div class="flex flex-wrap font-display font-bold justify-center text-lg border-4 my-4 border-red-900">
               {prompt}
               </div>
             )}
             
            <button onClick={()=>handleItems()} >Continue</button>
        </div>
    </>)
  }


  function LootPools() {

    return(
      <>
      <Title text={"Pick Your Loot Pool (Click to proceed)"} />
       <div class="flex flex-wrap"> 
      {places.map((obj, i)=>{
          let tempvar = true
          if(obj.place === null){
            tempvar=false
          }
          return(
              <div class="w-1/2 md:w-1/3 lg:w-1/5 py-4 flex justify-center border-green-500 text-white text-xl border-2 hover:bg-green-800" onClick={()=>openSecondModal(obj.index)}>
                 <div>
                    {tempvar && (
                <>
                  <div class="font-bold text-sm">{obj.place}</div>
                             
                 
                  </>
                
                )}
                {obj.level && (<div class="w-28 text-sm">Orc must be Level {obj.level}+ to Pillage</div>)}
                  {obj.cost && (<div class="w-28 text-sm">Cost: {obj.cost} $ZUG</div>)}
                  {obj.image && (<div class="w-28 border-1 flex flex-wrap justify-center text-center"><img src={obj.image} /></div>)}

                  
                </div>
              </div>
          )

          })}
      </div>
      </>
      )
  }


  function PillageAnimate(props){
    return(
      <>
      
      {places.map((obj)=>{
                let place
                if(lootPool === obj.index){
                    place = obj.place
                    return(
                      <div class="text-center">
                         <Title text={`Send Orc #${tokenid} to Pillage the ${place} for Weapons and Gear`} />
                      </div>
                     
                      )
                }
                
              })
              
              }

              
          <div class="flex flex-wrap justify-evenly"> 
         
        

        <div class="flex flex-wrap justify-center"> 
        {places.map((obj)=>{
                let place
                if(lootPool === obj.index){
                    
                    return(
                    <div class="relative">
                     <div class="border-1 flex flex-wrap justify-center text-center"><img src={obj.image} />
                    </div>

                    <div class="flex flex-wrap justify-center animate-pulse absolute bottom-0 right-0"> 
            
            <Orc class="absolute" format={"image"} orc={OrcObjectoPass}/>
             </div>
                    </div>
                    )
                }
                
              })
              
              }
          </div>

              

</div>
   

            <div class="flex flex-wrap justify-center py-3">
                <button class="px-3" onClick={onMintPressed}>Pillage!</button>
                </div>
      </>
    )
  }


function PlaceModal(props) {
    return (
      <>
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        
        <Modal.Body class="bg-green-600 p-2">
        {toggleItemsShow && <LootItems /> }
        {togglePlaceShow && <LootPools /> }
        {togglePillageShow &&  <PillageAnimate /> }
        
        
       

        <div class="flex flex-wrap justify-between">
                <div>
                {status && (<>{status} <button variant="dark" onClick={props.onHide}>Close</button> </>)}
               
                </div>
               
            </div>
   
       
      

        </Modal.Body>
 
      </Modal>
      </>
    );
  }  

  const handleItems = async () => { //TODO: implement)

    if(!checkedHelm && !checkedMainhand && !checkedOffhand){
      setPrompt("You have to pick something to loot for!")
    }else{
      setToggleItemsShow(!toggleItemsShow)
      setTogglePlaceShow(!togglePlaceShow)
            
    }            
  }
  

const openSecondModal = async (lootpoolIndex) => { //TODO: implement)

  if(!checkedHelm && !checkedMainhand && !checkedOffhand){
    setPrompt("You have to pick something to loot for!")
  }else{
    setLootPool(lootpoolIndex)
    setTogglePlaceShow(!togglePlaceShow)
    setTogglePillageShow(!togglePillageShow)
          
  }            
}

const onMintPressed = async (event) => { //TODO: implement
    
    
    let place = lootPool
    let tryHelm = checkedHelm
    let tryMainhand = checkedMainhand
    let tryOffhand = checkedOffhand
   

    

     const { status, txHash, success, receipt } = await pillage({tokenid, place, tryHelm, tryMainhand, tryOffhand} );
     setStatus(status);

     let obj = {address: wallet, token:tokenid, tx:receipt}

     console.log(place, tryHelm, tryMainhand, tryOffhand, obj)
     ///check for successful transaction
       if(success ===true){
       
            updatePillage(obj)
            
         }else{
 
            setStatus("Something went wrong");
  
       }
   };
  
  return (
<>
         
    <button variant="dark" onClick={() => setModalShow(true)}>
    Pillage with selected Orc!
        </button>
  
        <PlaceModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />

</>



  );
}

export default Pillage;



