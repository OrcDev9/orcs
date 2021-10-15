import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";

import { db } from "./initFirebase";
import { getDatabase, ref, set, onValue, query, get,child, orderByValue, push, orderByChild, limitToLast} from "firebase/database";

const Horde = ({contract, web3}) => {
  

const [rockswithrev, setRockswithrev] = useState();
const [trainCount, setTrainCount] = useState(0);
const [farmCount, setFarmCount] = useState(0);
const [nothingCount, setNothingCount] = useState(0);
const [stakingCount, setStakingCount] = useState(0);
const [tokenSupply, setTokenSupply] = useState();






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





useEffect(async() => {

setTokenSupply(await contract.methods.totalSupply().call());

const init = async () => {


  
  const OrcDisplayRef = ref(db, 'orcs/')
  let arr = []
  onValue(OrcDisplayRef, (snapshot) =>{
                let obj = snapshot.val();
          
                   Object.entries(obj).forEach(([key, rock])=>{
                 
                      arr.push(rock)
                   })
          
                   
         }, {
          onlyOnce: true
        })
         setRockswithrev(arr) 

  getStats(arr)

  
};

init()
     
  

}, [db]);


return (
    <>

<h2>What is everybody doing?</h2>


{rockswithrev && (
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
      <th class="border border-green-600"> Claimable</th>
      <th class="border border-green-600"> Total Zug</th>
      <th class="border border-green-600"> Activity Timestamp</th>

    </tr>
    </thead>
    <tbody>
  {( rockswithrev.map((rock, index)=>{

    let t = new Date(rock.time*1000)
    t = t.toLocaleString()

  return(<>
     <tr key={rock.tokenid} class="text-center text-sm">
    <td class="border border-green-600"> 
    <a target="_blank" href={`https://opensea.io/assets/0x7d9d3659dcfbea08a87777c52020BC672deece13/${rock.tokenid}`}>{rock.tokenid}</a>
    </td>
    <td class="border border-green-600">
    <a target="_blank" href={`https://etherscan.io/address/${rock.owner}/`}>{rock.owner}</a>
    </td>
    <td class="border border-green-600"> {rock.action}</td>
    <td class="border border-green-600"> {rock.body}</td>
    <td class="border border-green-600"> {rock.helm}</td>
    <td class="border border-green-600"> {rock.mainhand}</td>
    <td class="border border-green-600"> {rock.offhand}</td>
    <td class="border border-green-600"> {rock.level}</td>
    <td class="border border-green-600"> {rock.claimable}</td>
    <td class="border border-green-600"> {4 + parseInt(rock.totalZug)}</td>
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

export default Horde;
