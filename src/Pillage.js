import ConnectWallet from "./ConnectWallet";
import {
  getCurrentWalletConnected, //import here
  mintNFT, getTokenSupply, getGasPrice, getEthPrice, isSaleActive, getContractPrice, tokensByOwner, getContract, getErc, pillage
  
} from "./utils/interact.js";
import { db } from "./initFirebase";
import { getDatabase, ref, set, onValue, query, get,child, equalTo, orderByValue, push, orderByChild, limitToFirst, limitToLast, startAt, endAt} from "firebase/database";
import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import town from "./media/images/Town.png"
import dungeon from "./media/images/Dungeon.png"
import crypt from "./media/images/Crypt.png"
import castle from "./media/images/Castle.png"
import dragon from "./media/images/Dragon.png"
import ether from "./media/images/Ether.png"
import Modal from 'react-bootstrap/Modal'

const places = [
    {place: "TOWN", level:1, image:town},
    {place: "DUNGEON", level:3, image:dungeon},
    {place: "CRYPT", level:6, image:crypt},
    {place: "CASTLE", level:15, image:castle},
    {place: "DRAGONS LAIR", level:25, image:dragon},
    {place: "THE ETHER", level:36, image:ether}]

//const places = [{ "places": ["TOWN", "DUNGEON", "CRYPT", "CASTLE", "DRAGONS_LAIR", "THE_ETHER", 
//  "TAINTED_KINGDOM", "OOZING_DEN", "ANCIENT_CHAMBER", "ORC_GODS"] }]


function Pillage({tokenid}) {

const {nftContract, ercContract, web3} = getContract()
const [qty, setQty] = useState(0);
const [walletAddress, setWallet] = useState("");
const [status, setStatus] = useState("");
const [zug, setZug] = useState("");
const [zugClaim, setZugClaim] = useState("");
const [cost, setCost] = useState(0);
const [price, setPrice] = useState(qty * cost);
const [ethprice, setEthPrice] = useState(0);
const [txProgress, setTxProgress] = useState(0);
const [txIntervalId, setTxIntervalId] = useState();
const [tokenSupply, setTokenSupply] = useState();
const [isMetamask, setIsMetamask] = useState(true);
const [activeSale, setActiveSale] = useState(true);
const [gasPrice, setGasPrice] = useState(0);
const [collections, setCollection] = useState([]);
const [orcId, setOrcId] = useState(69);
const [showCollectionToggle, setShowCollectionToggle] = useState(false);
const [myOrcs, setMyOrcs] = useState();
const [modalShow, setModalShow] = useState(false);

const orcLookupRef = useRef(0);

const wallet4 = "0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"
const tempAddress = "0x3FE61420C33b0E41DDd763adaAeB0b638E78b768"



function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           Pick Your Loot Pool
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
         
         <div class="flex flex-wrap"> 
        {places.map((obj, i)=>{

            return(
                <div class="w-1/3" onClick={onMintPressed}>
                <div>{obj.place}</div>
                <div><img src={obj.image} /></div>
                <div>Level {obj.level} +</div>
                </div>
            )

            })}
</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  


const onMintPressed = async (event) => { //TODO: implement
    
    
    let place = 1  
    let tryHelm = 1
    let tryMainhand = 1 
    let tryOffhand = 1

     const { status, txHash, success } = await pillage({tokenid, place, tryHelm, tryMainhand, tryOffhand} );
     setStatus(status);
     
     ///check for successful transaction
       if(success ===true){
           setTxProgress(100)
            
         }else{
           setTxProgress(0)
        
  
       }
   };
  




  return (
<>
         
    <Button variant="dark" onClick={() => setModalShow(true)}>
    Pillage with selected Orc!
        </Button>
  
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />

</>



  );
}

export default Pillage;


