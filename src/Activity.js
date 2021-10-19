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
  let start = 1
  let stop = tokenSupply
  let results = await lookupAllOrcs({start, stop})

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
