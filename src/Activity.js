import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar'


const Activity = ({contract, web3}) => {

const [totalPlanets, setTotalPlanets] = useState(0);
const [rockswithrev, setRockswithrev] = useState();
const [currentIndex, setCurrentIndex] = useState();
const [loading, setLoading] = useState();
const [trainCount, setTrainCount] = useState(0);
const [farmCount, setFarmCount] = useState(0);
const [nothingCount, setNothingCount] = useState(0);
const cons = 25

const requestData = async(i)=>{

  let a = await contract.methods.tokenURI(i).call()
  var b = a.split(",")
  var c = JSON.parse(atob(b[1]))

  let activity = await contract.methods.activities(i).call()
 
  let time = activity.timestamp
  let owner = activity.owner

  let activitymap = null
  switch(parseInt(activity.action)) {
      case 1:
        activitymap = "Farming"
        break;
      case 2:
        activitymap = "Training"       
        break;
      default:
        activitymap = "Nothing"
        
    }


const  orcObj = {owner: owner, time: time, action: activitymap, tokenid: i }

const mergedObject = {
  ...c,
  ...orcObj
};
 

  return mergedObject
}




useEffect(() => {

  const getStats = async () => {

    let f = 0
    let t = 0
    let n = 0

    rockswithrev && rockswithrev.map((rock)=>{
    
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

    setFarmCount(f)
    setNothingCount(n)
    setTrainCount(t)
  }
  const init = async () => {
    // set school contract
    setLoading(true)
    let arr = []
    const totalPlanets = await contract.methods.totalSupply().call();
    setTotalPlanets(totalPlanets)
   
    const runs = parseInt(totalPlanets/cons)
    
   
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
    getStats()
    setLoading(false)
    
  };

     
  init()

}, [0]);


return (
    <>

<h2>What is everybody doing?</h2>

<p>
  This component will show you what each minted orc is doing plus stats. It needs to cycle though all of them to please be patient.
</p>
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
      <td>{((totalPlanets - nothingCount)/totalPlanets).toFixed(2)} % </td>
    </tr>
  </tbody>
</table>

{loading? <>
<div>Looping through {totalPlanets} orcs, a few at a time. Please give it a few minutes. {currentIndex}% complete.</div>
<ProgressBar now={currentIndex} label={`${currentIndex}%`}/> </>:
<table class="table-auto border-collapse border border-green-800">

  <thead>
    <tr class="text-center text-xs">
    <th class="border border-green-600"> Token ID</th>
    <th class="border border-green-600"> Owner</th>
    <th class="border border-green-600"> Activity</th>
      <th class="border border-green-600"> Body</th>
      <th class="border border-green-600"> Helm</th>
      <th class="border border-green-600"> Number</th>
      <th class="border border-green-600"> Mainhand</th>
      <th class="border border-green-600"> MainhandTier</th>
      <th class="border border-green-600"> Offhand</th>
      <th class="border border-green-600"> OffhandTier</th>
      <th class="border border-green-600"> Level</th>
      <th class="border border-green-600"> ZugBonus</th>
    </tr>
    </thead>
    <tbody>
  {rockswithrev && (rockswithrev.map((rock)=>{

  return(<>
     <tr class="text-center text-sm">
    <td class="border border-green-600"> 
    <a target="_blank" href={`https://opensea.io/assets/0x7d9d3659dcfbea08a87777c52020BC672deece13/${rock.tokenid}`}>{rock.tokenid}</a>
    </td>
    <td class="border border-green-600">
    <a target="_blank" href={`https://etherscan.io/address/${rock.owner}/`}>{rock.name}</a>
    </td>
    <td class="border border-green-600"> {rock.action}</td>
    {rock.attributes && (rock.attributes.map((a)=>{

          return(<>
          
          <td class="border border-green-600"> {a.value}</td>


          </>)
          }))}

    
    </tr>
    </>)

    }))}
</tbody>
</table>}

    </>
  );
};

export default Activity;
