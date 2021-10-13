import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { toComputedKey } from "@babel/types";
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
  setCurrentToken(token)
  let orcs
  let activity
  

  let time = null
  let owner = null
  let level = null
  let activitymap = null
  let claimableMethod = 0

  activity = await contract.methods.activities(token).call()
  time = activity.timestamp
  owner = activity.owner  
  switch(parseInt(activity.action)) {
      case 1:
        activitymap = "Farming"
        break;
      case 2:
        activitymap = "Training"  
      //  claimableMethod = parseInt(await contract.methods.claimable(token).call())
        break;
      default:
        activitymap = "Nothing"
        
    }

    orcs = await contract.methods.orcs(token).call()   

    level = (parseInt(orcs.lvlProgress) + (claimableMethod*3/2))/1000

    

const  orcObj = {owner: owner, time: time, action: activitymap, tokenid: token, level:level }

const mergedObject = {
  ...orcs,
  ...orcObj
};
 

  return mergedObject
}

const getStats = async (merged) => {

  let f = 0
  let t = 0
  let n = 0

  merged.map((rock)=>{
  
    switch(rock.action) {
      case "Farming":
       f++          
        break;
      case "Training":
       t++
        break;
      default:
      n++
        
    }
  })

  let s = ((tokenSupply - n)/tokenSupply).toFixed(2)
  setFarmCount(f)
  setNothingCount(n)
  setTrainCount(t)
  setStakingCount(s)
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
          arr.push(owners)
        
        setRockswithrev(owners) 
        i++

         }catch(e)
         
         {console.log(e, i)}

         
    }
   
   var merged = [].concat.apply([], arr);
  setRockswithrev(merged) 
  getStats(merged)
  setLoading(false)
  
};


useEffect(() => {
     if(showData){
      init()
     }
  

}, [showData]);


return (
    <>

<h2>What is everybody doing?</h2>

<p>
  This component will show you what each minted orc is doing plus other stats in a table. It needs to cycle though all of them, so please be patient. If it gets stuck or fails,
  reduce the number of Orcs to scan at once. Under the hood, the app is calling the claimable, orcs and activities methods at the same time. 
</p>

<div class="flex flex-wrap items-baseline space-x-3">
  <div>
  <Form.Label>Orcs to scan at once</Form.Label>
  </div>
  <div>
    
  <Form.Control  value={cons} onChange={handleInput}/>
  </div>
  <div>

  <Button onClick={handleClick}>{showData ? ("Restart") : "Scan Orcs"}</Button>
  </div>



</div>


{loading? <>


<p>Looping through {tokenSupply} orcs, {cons} at a time. Please give it a few minutes. {currentIndex}% complete.
Currently scanning Orc # {currentToken}
</p>

<ProgressBar now={currentIndex} label={`${currentIndex}%`}/> </>:
rockswithrev && (
  <>
  <table class="w-80">
  <tbody>
    <tr class="text-center font-semibold">
      <td>Farming</td>
      <td>Training</td>
      <td>Nothing</td>
      <td>Staking</td>
    </tr>
    <tr class="text-center">
      <td>{farmCount}</td>
      <td>{trainCount}</td>
      <td>{nothingCount}</td>
      <td>{stakingCount} % </td>
    </tr>
  </tbody>
</table>
<br/>
<table class="table-auto border-collapse border border-green-800">

  <thead>
    <tr class="text-center text-xs">
    <th class="border border-green-600"> Token ID</th>
    <th class="border border-green-600"> Owner</th>
    <th class="border border-green-600"> Activity</th>
      <th class="border border-green-600"> Body</th>  
      <th class="border border-green-600"> Helm</th>
      <th class="border border-green-600"> Mainhand</th>
      <th class="border border-green-600"> Offhand</th>
      <th class="border border-green-600"> Level</th>
      <th class="border border-green-600"> Total Zug</th>
      <th class="border border-green-600"> Activity Timestamp</th>

    </tr>
    </thead>
    <tbody>
  {rockswithrev && (rockswithrev.map((rock)=>{

    let t = new Date(rock.time*1000)
    t = t.toLocaleString()
    



  return(<>
     <tr key={rock.tokenid} class="text-center text-sm">
    <td class="border border-green-600"> 
    <a target="_blank" href={`https://opensea.io/assets/0x7d9d3659dcfbea08a87777c52020BC672deece13/${rock.tokenid}`}>{rock.tokenid}</a>
    </td>
    <td class="border border-green-600">
    <a target="_blank" href={`https://etherscan.io/address/${rock.owner}/`}>Orc #{rock.owner}</a>
    </td>
    <td class="border border-green-600"> {rock.action}</td>
    <td class="border border-green-600"> {rock.body}</td>
    <td class="border border-green-600"> {rock.helm}</td>
    <td class="border border-green-600"> {rock.mainhand}</td>
    <td class="border border-green-600"> {rock.offhand}</td>
    <td class="border border-green-600"> {rock.level}</td>
    <td class="border border-green-600"> {4 + parseInt(rock.zugModifier)}</td>
    <td class="border border-green-600"> {t}</td>

    
    </tr>
    </>)

    }))}
</tbody>
</table>
</>
)}

    </>
  );
};

export default Activity;
