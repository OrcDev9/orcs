import {pillage, lookupMultipleOrcs} from "./utils/interact.js";
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
import training from "./media/training.gif"
import Modal from 'react-bootstrap/Modal'
import Orc from "./Orc";
import { getDatabase, ref, set, onValue, query, get,child, equalTo, orderByValue, push, orderByChild, limitToLast} from "firebase/database";
import Title from "./Title.js";


function Battle({tokenid, wallet, orcs}) {

const [lootPool, setLootPool] = useState(0);
const [status, setStatus] = useState();
const [prompt, setPrompt] = useState();
const [modalShow, setModalShow] = useState(false);
const [toggleItemsShow, setToggleItemsShow] = useState(true);
const [togglePlaceShow, setTogglePlaceShow] = useState(false);
const [togglBattleButtonShow, setTogglBattleButtonShow] = useState(false);
const [counter, setCounter] = useState(0);
const [checkedHelm, setCheckedHelm] = useState(false);
const [checkedMainhand, setCheckedMainhand] = useState(false);
const [checkedOffhand, setCheckedOffhand] = useState(false);
const [fightStatus, setFightStatus] = useState("Round One!");

const [myOrcs, setMyorcs] = useState();    
const [showOrc, setShowOrc] = useState(false);
const [winnerId, setWinnerId] = useState();
const [orcId, setOrcId] = useState();
let OrcObjectoPass 

const orcLookupRef = useRef();



const handleRandom = async (e) => {
  
    e.preventDefault()
    let t = Math.random() * (5051 - 1) + 1
    t = parseInt(t)

    setShowOrc(false)
    
    let tempArr = [] 
    tempArr.push(t) 
  
    if((t > 0) && (t < 5051)){
      let multiOrcs = await lookupMultipleOrcs({array: tempArr})
      console.log(multiOrcs, tempArr)
      setMyorcs(multiOrcs)
      setShowOrc(true)          
    }   
        };

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

const updateBattle = async (obj) => {
 
  const db = getDatabase();
  const timestamp = Date.now()

        const battleRef = ref(db, 'etherorcs/battle/')
        const newBattleRef = push(battleRef);
      
        await set(newBattleRef, {
            lastBattle: timestamp,
            fighter1: obj.fighter1.tokenid,
            score1: obj.score1,
            fighter2: obj.fighter2.tokenid,
            score2: obj.score2,
            winner: obj.winner,
          });
         
 

}



orcs.map((orc)=>{

  if(orc.tokenid === tokenid)
  OrcObjectoPass = orc

})

const BattleHandler = () => {

    return(
        <>
      
    <div class="flex flex-wrap gap-3">
   

            <button onClick={handleRandom}>
            Random Opponent

            </button>

       
                       <div class="flex flex-wrap justify-center">
                            <form onSubmit={handleOrcSubmit}>
                         <input  placeholder={"Type Orc Id here"} ref={orcLookupRef} />
                         <button class="hidden" type="submit">Unleash the Orc</button> 
                         </form>    
                       </div>  
                       <button onClick={handleOrcSubmit}> Choose Opponent </button>
                  
 

  
        </div>

        {prompt && (
               <div class="flex flex-wrap font-display font-bold justify-center text-lg border-4 my-4 border-red-900">
               {prompt}
               </div>
             )}
             
           

        </>
    )
    
}


  function SelectFighter() {

    return(<>
        <div class="p-2 my-1">  
        <div class="text-3xl" >
          <Title text={"Battle Royale"} />
            
        </div>
        <div class="flex flex-wrap justify-around">
        <Orc class="absolute" format={"figure"} orc={OrcObjectoPass}/>
        {showOrc && <div class="animate-pulse align-self-center"><button onClick={()=>handleBattle()} class="h-32">Fight!</button></div>}
        {showOrc && <Orc format={"figure"} orc={myOrcs[0]} />}
        </div>
        
        <BattleHandler />
        
        </div>
    </>)
  }


  function BattleAction(props) {


    return(
      <>
      <div class="flex flex-wrap justify-around">
          
      <div class="relative">
         <div class="border-1 flex flex-wrap justify-center text-center"><img src={training} />
                    </div>

         <div class="flex flex-wrap justify-center absolute bottom-10 left-60"> 
         <div class="w-40" style={{
              transform: "scaleX(-1)" }}>
          <Orc format={"image"} orc={OrcObjectoPass}/>
          </div>
          </div>

         <div class="flex flex-wrap justify-center absolute bottom-10 left-96"> 

          <div class="w-40">
          <Orc format={"image"} orc={myOrcs[0]} />
          </div>
             </div>

             <div class="text-6xl text-center absolute top-10 right-48"> 
             <Title text={fightStatus} />
             </div>
        
        </div>
   </div>
   <div class="flex flex-wrap justify-end">
       {togglBattleButtonShow && <button onClick={()=>handleContinue()}>Fight!</button>}

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
        {toggleItemsShow && <SelectFighter /> }
        {togglePlaceShow && <BattleAction /> }
       
        
        
       

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

  const handleBattle = async () => {

      setPrompt("Battle commencing!")
      setToggleItemsShow(!toggleItemsShow)
      setTogglePlaceShow(!togglePlaceShow)
      setTogglBattleButtonShow(!togglBattleButtonShow)
            
                
  }

  
  const handleContinue = async () => {

    let myScore = OrcObjectoPass.helm*.25 + OrcObjectoPass.mainhand*.5 + OrcObjectoPass.offhand*.25
let hisScore = myOrcs[0].helm*.25 + myOrcs[0].mainhand*.5 + myOrcs[0].offhand*.25

let status = myScore > hisScore ? "You win!" : "You lose!"  
setFightStatus(status)
let winnerID = myScore > hisScore ? OrcObjectoPass.tokenid : myOrcs[0].tokenid
let obj = {fighter1: OrcObjectoPass, fighter2: myOrcs[0], winner: winnerID, score1: myScore, score2: hisScore}
updateBattle(obj)
setTogglBattleButtonShow(!togglBattleButtonShow)
console.log(fightStatus, myScore, hisScore)
        
              
}

const resetModal = () => {

setToggleItemsShow(!toggleItemsShow)
setTogglePlaceShow(!togglePlaceShow)

}
  
  return (
<>
         
    <button variant="dark" onClick={() => setModalShow(true)}>
    Battle!
        </button>
  
        <PlaceModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />

</>



  );
}

export default Battle;



