import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { updateDatabase } from "./utils/services";
import { lookupOrc , getContract, lookupAllOrcs } from "./utils/interact"; 
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';




const Activity = ({contract}) => {

const [rockswithrev, setRockswithrev] = useState();
const [currentIndex, setCurrentIndex] = useState();
const [currentToken, setCurrentToken] = useState();
const [loading, setLoading] = useState();
const [trainCount, setTrainCount] = useState(0);
const [farmCount, setFarmCount] = useState(0);
const [nothingCount, setNothingCount] = useState(0);
const [stakingCount, setStakingCount] = useState(0);
const [tokenSupply, setTokenSupply] = useState();
const [showData, setShowData] = useState(false);
const [cons, setCons] = useState(10);
const [web3, setWeb3] = useState(10);


const handleInput = (e)=>{
  e.preventDefault()
 setCons(e.target.value)
  }

const handleClick = (e)=>{
e.preventDefault()
setShowData(!showData)
}


const init = async () => {
  // set school contract

  setLoading(true)
  let start = 1
  let stop = tokenSupply
  let results = await lookupAllOrcs({start, stop})

  results.map((orc)=>{
    updateDatabase(orc) 
  })

  console.log("Results", results)
  
 setLoading(false)
  
};


useEffect(async() => {

  let supply = await contract.methods.totalSupply().call()
  setTokenSupply(supply);

     if(showData){
      init()
     }
  

}, [showData]);


return (
    <>

  

 

  {!loading ? ( 
    <Button onClick={handleClick}>Update Orc Metadata</Button>
  ) : ( <Button disabled><div class="animate-bounce">Loading...</div></Button>)}

 </>



  );
};

export default Activity;
