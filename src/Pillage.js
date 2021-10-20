import {pillage} from "./utils/interact.js";
import { useState, useEffect, useRef } from "react";
import town from "./media/images/Town.png"
import dungeon from "./media/images/Dungeon.png"
import crypt from "./media/images/Crypt.png"
import castle from "./media/images/Castle.png"
import dragon from "./media/images/Dragon.png"
import ether from "./media/images/Ether.png"
import Modal from 'react-bootstrap/Modal'
import Orc from "./Orc";

const places = [
    {place: "TOWN", level:1, image:town, index:0},
    {place: "DUNGEON", level:3, image:dungeon, index:1},
    {place: "CRYPT", level:6, image:crypt, index:2},
    {place: "CASTLE", level:15, image:castle, index:3},
    {place: "DRAGON'S LAIR", level:25, image:dragon, index:4},
    {place: "THE ETHER", level:36, image:ether, index:5}]

//const places = [{ "places": ["TOWN", "DUNGEON", "CRYPT", "CASTLE", "DRAGONS_LAIR", "THE_ETHER", 
//  "TAINTED_KINGDOM", "OOZING_DEN", "ANCIENT_CHAMBER", "ORC_GODS"] }]


function Pillage({tokenid}) {

const [lootPool, setLootPool] = useState(0);
const [status, setStatus] = useState();
const [prompt, setPrompt] = useState();
const [modalShow, setModalShow] = useState(false);
const [secondModalShow, setSecondModalShow] = useState(false);

const [checkedHelm, setCheckedHelm] = useState(false);
const [checkedMainhand, setCheckedMainhand] = useState(false);
const [checkedOffhand, setCheckedOffhand] = useState(false);
const [checkedAll, setCheckedAll] = useState(false);

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
      <label class="font-semibold text-2xl">
        <input type="checkbox" checked={value} onChange={onChange} />
        {"   "}
        {label}
      </label>
    );
  };

  function LootItems() {

    return(<>
        <div class="border-4 p-3 mt-3">  
        <div>
            <p>Select item slots to pillage for.</p>
        </div>
        <div class="flex flex-wrap justify-between" >
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
        </div>
    </>)
  }


function PlaceModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closebutton>
          <Modal.Title id="contained-modal-title-vcenter">
          <div class="font-serif"> Pick Your Loot Pool (Click to proceed)</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <LootItems />
         <div class="flex flex-wrap"> 
        {places.map((obj, i)=>{

            return(
                <div class="w-1/3 py-4 flex justify-center border-white border-2 hover:bg-gray-100" onClick={()=>openSecondModal(obj.index)}>
                  <div>
                    <div class="font-bold">{obj.place}</div>
                    <div class="w-32">Orc must be Level {obj.level}+ to Pillage</div>
                    <div><img src={obj.image} /></div>
                    
                  </div>
                </div>
            )

            })}
        </div>

        <div class="flex flex-wrap font-serif font-bold justify-center text-xl border-2 border-red-200">
        {prompt}
        </div>

        </Modal.Body>
        <Modal.Footer>
         <button onClick={props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }  

function LootPoolModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closebutton>
          <Modal.Title id="contained-modal-title-vcenter">
              {places.map((obj)=>{
                let place
                if(lootPool === obj.index){
                    place = obj.place
                    return(`Send Orc #${tokenid} to Pillage the ${place} for Weapons and Gear`)
                }
                
              })
              
              }
         
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
         
         <div class="flex flex-wrap justify-center animate-pulse"> 
            
       <Orc allData={false} tokenid={tokenid} />
        </div>

        <div class="flex flex-wrap justify-between">
                <div>
                {status && (<>{status} <button variant="dark" onClick={props.onHide}>Close</button> </>)}
               
                </div>
                <div>
                <button variant="dark" onClick={onMintPressed}>Pillage!</button>
                </div>
            </div>
        
        </Modal.Body>
        <Modal.Footer>
            
          
          
        </Modal.Footer>
      </Modal>
    );
  }
  

const openSecondModal = async (lootpoolIndex) => { //TODO: implement)

  if(!checkedHelm && !checkedMainhand && !checkedOffhand){
    setPrompt("You have to pick something to loot for!")
  }else{
    setLootPool(lootpoolIndex)
            setSecondModalShow(true)
            setModalShow(false)
  }



            
}

const onMintPressed = async (event) => { //TODO: implement
    
    
    let place = lootPool
    let tryHelm = checkedHelm
    let tryMainhand = checkedMainhand
    let tryOffhand = checkedOffhand

     const { status, txHash, success } = await pillage({tokenid, place, tryHelm, tryMainhand, tryOffhand} );
     setStatus(status);
     
     ///check for successful transaction
       if(success ===true){
        
            
         }else{
 
            setStatus("Something went");
  
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

        <LootPoolModal
          show={secondModalShow}
          onHide={() => setSecondModalShow(false)}
        />

</>



  );
}

export default Pillage;


