import ConnectWallet from "./ConnectWallet";
import {
  getCurrentWalletConnected, //import here
  mintNFT, getTokenSupply, getGasPrice, getEthPrice, isSaleActive, getContractPrice, tokensByOwner, getContract, getErc, doAction
} from "./utils/interact.js";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {app, analytics} from "./initFirebase"
import logo from "./media/logo.svg"
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Alert } from "react-bootstrap";

function Stake({nftContract}) {
 
const [action, setAction] = useState("Unstake");
const [orcData, setOrcData] = useState(null);
const [status, setStatus] = useState(null);

const handleActionChange = async (event) => { //TODO: implement
    event.preventDefault()
    setAction(event.target.value)
   };

const handleOrdDataChange = async (event) => { //TODO: implement
    event.preventDefault()
    setOrcData(event.target.value)
   };


  const doActionClick = async (event) => { //TODO: implement

    
    let actionInt = null
    switch(action) {
        case "Farm":
            actionInt = 1
          break;
        case "Train":
            actionInt = 2
          break;
        default:
            actionInt = 0
      }
    
      if(actionInt && orcData){
        const {success, status} = await doAction(actionInt, orcData)
        setStatus(status);
    }else{
        setStatus("empty fields somewhere")
    }

  
    /*
    setTxProgress(33)
     const { status, txHash, success } = await mintNFT(qty);
     setStatus(status);
     
     ///check for successful transaction
       if(success ===true){
           setTxProgress(100)
            
         }else{
           setTxProgress(0)
        
  
       }*/

   };


  return (
<div class="p-2 border-2">
<h2>Stake</h2>  

<div class="mb-3"> 
<Form>

  <Row className="mb-3">
    <Form.Group as={Col} controlId="formGridCity" onChange={handleOrdDataChange}>
      <Form.Label>Orc ID</Form.Label>
      <Form.Control />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Action</Form.Label>
      <Form.Select defaultValue="Unstake" onChange={handleActionChange}>
        <option>Unstake</option>
        <option>Farm</option>
        <option>Train</option>
      </Form.Select>
    </Form.Group>


  </Row>



  <Button variant="primary" onClick={doActionClick}>
    doAction
  </Button>
</Form>
</div>
<Alert>{status}</Alert>

</div>


  );
}

export default Stake;


