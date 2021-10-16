import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { updateDatabase } from "./utils/services";
import { lookupOrc } from "./utils/interact"; 

const Activity = ({contract, web3}) => {

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


const handleInput = (e)=>{
  e.preventDefault()
 setCons(e.target.value)
  }

const handleClick = (e)=>{
e.preventDefault()
setShowData(!showData)
}

const requestData = async(token)=>{
let orcData = await lookupOrc(token)
updateDatabase(orcData) 
}

const init = async () => {
  // set school contract
  setLoading(true)
  let arr = []

  let supply = await contract.methods.totalSupply().call()
  setTokenSupply(supply);
 
  const runs = parseInt(supply/cons)
 
  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

 
 for(let i =0; i< runs;){  
  

  let start = (i*cons) + 1
  let stop = (start+cons)
  setCurrentIndex(parseInt(i/runs*100))
  let owners
    
      try{

        owners = await Promise.all(

          range(start, stop, 1).map((index) => (
            requestData(index)
          )))
         i++

         }catch(e)
         
         {console.log(e, i)}

         
    }
   
  setLoading(false)
  
};


useEffect(() => {
     if(showData){
      init()
     }
  

}, [showData]);


return (
    <>

  <Button disabled onClick={handleClick}>{showData ? ("Restart") : "Update Orc Metadata"}</Button>
<br/>

<p>Looping through {tokenSupply} orcs, {cons} at a time. Please give it a few minutes. {currentIndex}% complete.
Currently scanning Orc # {currentToken}
</p>

<ProgressBar now={currentIndex} label={`${currentIndex}%`}/> </>



  );
};

export default Activity;
