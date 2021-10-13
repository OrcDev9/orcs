import React, { useState, useEffect } from "react";



const Activity = ({contract, web3}) => {

const contractAddress= "0x1E4e1208Ab4BA7740FE73D3728DF1f89bE6C649b"
const [totalPlanets, setTotalPlanets] = useState(0);
const [rockswithrev, setRockswithrev] = useState();
const [currentIndex, setCurrentIndex] = useState();

const cfinit = {method: 'GET', headers: { } }

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

  const init = async () => {
    // set school contract


    const totalPlanets = await contract.methods.totalSupply().call();
    setTotalPlanets(totalPlanets)
    let arr = []

   for(let i =1; i< totalPlanets; i++){
             
      
        try{

          const data = await requestData(i)
          console.log(data)
          arr.push(data)
          setCurrentIndex(i)
          i++

           }catch(e)
           
           {console.log(e, i)}

           setRockswithrev(arr) 
      }


  };

     
  init()

}, []);


return (
    <>


<h2>What is everybody doing?</h2>

<table class="table-auto border-collapse border border-green-800">

  <thead>
    <tr class="text-center">
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
     <tr class="text-center">
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
</table>

    </>
  );
};

export default Activity;
