import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { lookupMultipleOrcs } from "./utils/interact"; 
import { ProgressBar } from "react-bootstrap";
import { CSVLink } from "react-csv";



const GetAllOrcMetaData = ({contract}) => {

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
    { label: "totalZug", key: "totalZug"},
    { label: "image", key: "image"},
    { label: "bodyImage", key: "bodyImage"},
    { label: "helmImage", key: "helmImage"},
    { label: "mainhandImage", key: "mainhandImage"},
    { label: "offhandImage", key: "offhandImage"},
  ];

const [loading, setLoading] = useState();
const [tokenSupply, setTokenSupply] = useState();
const [showData, setShowData] = useState(false);
const [showExport, setShowExport] = useState(false);
const [progress, setProgress] = useState(0);
const [csvReport, setCsvReport] = useState([1,2,3])

const handleClick = (e)=>{
e.preventDefault()
setShowData(!showData)
}


const showexporthandle = (e)=>{
  e.preventDefault()
  console.log(csvReport)
 // setShowExport(!showExport)
  }




const init = async () => {
  // set school contract
  setProgress(1)
  setLoading(true)
  let results = []
  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

  let array = range(1,200,1)

  results = await lookupMultipleOrcs({array})

  results = results.map(result => {

    var decodedImageStringAtoB 
    var extractImages 
    var cleanExtract
    let image 
    let image2 
    let image3 
    let image4 

    try {
      decodedImageStringAtoB = atob(result.image.split(',')[1]);
      extractImages = decodedImageStringAtoB.split(`xlink:href="`)
      cleanExtract = extractImages.map((string)=>{
        if(string.includes(`data:image`)){
        var a = string.split(`"/>`)
        return(a[0])
      }
        return null
        })

    } catch (error) {
      console.log(error)
    }

      try{
          image = cleanExtract[1] 
          image2 = cleanExtract[2] 
          image3 = cleanExtract[3]
          image4 = cleanExtract[4]

          }catch(e){
            console.log(e)
          }
          
          return ({...result, bodyImage: image, helmImage: image2, mainhandImage: image3, offhandImage: image4 })


  })

  let csv = {
    data: results,
    headers: headers,
    filename: 'OrcActivityReport.csv'}
    setCsvReport(csv) ///for export



  setProgress(100)
setLoading(false)

  
};


useEffect(async() => {

     if(showData){
      init()
     }
  

}, [showData]);


return (
    <>

  



  {!loading ? ( 
    <Button onClick={handleClick}>Update Orc Metadata Then Export CSV</Button>
  ) : ( <Button disabled><div class="animate-bounce">Loading...</div></Button>)}

  {loading && <ProgressBar now={progress} label={`${progress}%`} />}

  <Button onClick={showexporthandle}>Download CSV</Button>

  {showExport && <CSVLink data={csvReport}>Download CSV</CSVLink>}
 </>



  );
};

export default GetAllOrcMetaData;

