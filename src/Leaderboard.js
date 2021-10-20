import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { getContract } from "./utils/interact";
import { db } from "./initFirebase";
import { getDatabase, ref, set, onValue, equalTo, query, get,child, orderByValue, push, orderByChild, limitToFirst, limitToLast, startAt, endAt} from "firebase/database";
import Activity from "./Activity";

const Leaderboard = ({tokenid}) => {
  
const {nftContract, web3} = getContract()
const contract = nftContract
const [orcObject, setorcObject] = useState();
const [trainCount, setTrainCount] = useState(0);
const [farmCount, setFarmCount] = useState(0);
const [nothingCount, setNothingCount] = useState(0);
const [stakingCount, setStakingCount] = useState(0);
const [tokenSupply, setTokenSupply] = useState();
const [showData, setShowData] = useState(false);
const [csvReport, setCsvReport] = useState([1,2,3])
const [loading, setLoading] = useState();

///For file export
const headers = [
  { label: "tokenid", key: "tokenid" },
  { label: "owner", key: "owner" },
  { label: "actions", key: "action" },
  { label: "actionString", key: "actionString" },
  { label: "level", key: "level" },
  { label: "calcLevel", key: "calcLevel" },
  { label: "claimable", key: "claimable" },
  { label: "body", key: "body" },
  { label: "helm", key: "helm" },
  { label: "mainhand", key: "mainhand" },
  { label: "offhand", key: "offhand" },
  { label: "time", key: "time" },
  { label: "totalZug", key: "totalZug" }
];

const handleClick = (e)=>{

  e.preventDefault()
  setLoading(true)
  setShowData(!showData)
  }

 
const getStats = async (merged) => {

  let f = 0
  let t = 0
  let n = 0

  merged.map((orc)=>{

    switch(parseInt(orc.action)) {
      case 1:
       f++          
        break;
      case 2:
       t++
        break;
      default:
      n++
        
    }
  })

  let s = (((tokenSupply - n)/5050)*100).toFixed(2)
  setFarmCount(f)
  setNothingCount(n)
  setTrainCount(t)
  setStakingCount(s)
}

const getAllStats = async ()=>{
  const myOrcQuery = query(ref(db, 'orcs'), orderByChild('calcLevel'), limitToLast(20)) ///"0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"));

  let dataArry = []


onValue(myOrcQuery, (snapshot)=>{
 
      if(snapshot.exists()){    
        
        Object.entries(snapshot.val()).forEach(([key, value])=>{
  
        dataArry.push(value)         
        })


  console.log("Found Orcs. Orc of them",  dataArry)   

}else{
 
  console.log("Got No Orcs. NOrc of them") 
}
      
      },{onlyOnce: true})

      setorcObject(dataArry)
}

const init = async () => {

  const dbRef = ref(getDatabase());
 

  get(child(dbRef, `orcs/`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log("getDbase",snapshot.val())

      let csv = {data: snapshot.val(),
        headers: headers,
        filename: 'OrcActivityReport.csv'}
        setCsvReport(csv) ///for export
     //   setorcObject(snapshot.val())
     ///   getStats(snapshot.val())
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  
        
  setLoading(false)
};

useEffect(async () => {

setTokenSupply(await contract.methods.totalSupply().call());

if(tokenid){
  getAllStats()


  }


}, [tokenid]);







return (
    <>

<div class="text-lg font-bold font-serif flex flex-wrap justify-center">Leaderboard</div>  


{orcObject && (
  <>

<table class="table-auto border-collapse border border-green-800">

  <thead>
    <tr class="text-center text-xs">
    <th class="border border-green-600"> Token ID</th>
    <th class="border border-green-600"> Owner</th>
     <th class="border border-green-600"> Level</th>
 
    </tr>
    </thead>
    <tbody>
  {(orcObject.map((orc, index)=>{

    let t = new Date(orc.time*1000)
    t = t.toLocaleString()

  return(<>
     <tr key={orc.tokenid} class="text-center text-sm">
    <td class="border border-green-600"> 
    <a target="_blank" href={`https://opensea.io/assets/0x7d9d3659dcfbea08a87777c52020BC672deece13/${orc.tokenid}`}>{orc.tokenid}</a>
    </td>
    <td class="border border-green-600">
    <a target="_blank" href={`https://etherscan.io/address/${orc.owner}/`}>{orc.owner}</a>
    </td>
    <td class="border border-green-600"> {orc.calcLevel}</td>


    
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

export default Leaderboard;
