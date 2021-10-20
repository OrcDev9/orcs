import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { updateDatabase } from "./utils/services";
import { lookupAllOrcs } from "./utils/interact"; 





const Activity = ({contract}) => {

const [loading, setLoading] = useState();
const [tokenSupply, setTokenSupply] = useState();
const [showData, setShowData] = useState(false);

const handleClick = (e)=>{
e.preventDefault()
setShowData(!showData)
}


const init = async () => {
  // set school contract

  setLoading(true)
  let results = []
  let start = 1
  let stop = 1000///tokenSupply

  

  results[0] = await lookupAllOrcs({start, stop})
  start = start + 1000
  stop = stop + 1000
  results[1] = await lookupAllOrcs({start, stop})
  start = start + 1000
  stop = stop + 1000
  results[2] = await lookupAllOrcs({start, stop})
  start = start + 1000
  stop = stop + 1000
  results[3] = await lookupAllOrcs({start, stop})
  start = start + 1000
  stop = stop + 1000
  results[4] = await lookupAllOrcs({start, stop})
  start = start + 1000
  stop = stop + 1000
  results[5] = await lookupAllOrcs({start, stop})

  results = [...results[0], ...results[1],...results[2], ...results[3],...results[4],...results[4]]

  results.map((orc)=>{
    updateDatabase(orc) 
  })

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
