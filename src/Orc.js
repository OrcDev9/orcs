import { useState, useEffect } from "react";
import { updateDatabase } from "./utils/services";
import { lookupOrc } from "./utils/interact"; 
import React, { useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Modal } from "react-bootstrap";

function Orc({tokenid, format, orc}) {
 
const [orcData, setOrcData] = useState(null);
const [loading, setLoading] = useState(false);
const [showClaimable, setShowClaimable] = useState(false);
const [claimable, setClaimable] = useState(false);

let allData = false

///alldata
///pfp
///card
///figure

var decodedImageStringAtoB = atob(orc.image.split(',')[1]);
var extractImages = decodedImageStringAtoB.split(`xlink:href="`)
var cleanExtract = extractImages.map((string)=>{

  if(string.includes(`data:image`)){
    var a = string.split(`"/>`)

    return(a[0])
  }

  return null
 
})


const ref = useRef()
const pfpref = useRef()
const partsref = useRef()

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `Orc${tokenid}.png`
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])


  const onpfpClick = useCallback(() => {
    if (pfpref.current === null) {
      return
    }

    toPng(pfpref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `Orc${tokenid}PFP.png`
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })

  }, [pfpref])

useEffect(async () => {


const lookupsOrc = async ()=>{

    setLoading(true)
    let orcObj
    if(orc){
      orcObj = orc
    }else{
      orcObj = await lookupOrc(tokenid)
    }
    
    setOrcData(orcObj)

    setClaimable(((parseInt(orcObj.claimable))/Math.pow(10, 18)).toFixed(2))
    setShowClaimable(true)
       
    updateDatabase(orcObj) //update firestore eachtime someone looksup orc.
    setLoading(false)
  }

  lookupsOrc()


 },[tokenid])


if(format==="card"){

return(
<>
{orcData && (
<div ref={ref} class={"border-yellow-600 border-2 pt-4 pb-2 px-4 my-2"} style={{background: "#111111"}}>
<div class="space-y-2 pb-3">

  <div class="flex justify-center">
    <img width={200} src={orcData.image} alt={orcData.name} />
   </div>
   <div class="flex justify-center">
        <div class="font-semibold text-2xl ">{orcData.name}</div>
    </div>

   <div class="flex justify-center">
       <div class="font-semibold text-lg">Lvl: {orcData.calcLevel}</div>
   </div>
   <div class="flex justify-center">
       <div class="font-semibold text-xs text-center">{orcData.actionString} {showClaimable && `| ${claimable} Zug claimable`}</div>
   </div>
   <div class="flex justify-center">
       <div class="font-semibold text-xs">{`$Zug Bonus ${orcData.zugModifier}+`}</div>
   </div>

     <div class="text-sm">
    This orc is <strong>{orcData.actionString} </strong> and on the way to level <strong>{orcData.calcLevel}</strong>{showClaimable && ` with ${claimable} claimable.`}
    </div>
   
  
 
   
      {orcData && (orcData.attributes.map((a, i)=>{

return(<div key={orcData.name + i}>
<div class="flex justify-between border-b-2">
<div class="text-sm capitalize">{a['trait_type'] /*//fix this laer */}</div> 
<div class="font-semibold text-sm">{a.value}</div>

</div>  
</div>)
}))}

<div class="break-all text-xs">Owner: {orcData.username && (`${orcData.username} | `) }{orcData.owner}</div> 
</div>



</div>
)}

<div class="flex justify-evenly">
<button onClick={onButtonClick}>Download Stats PNG</button>
</div>

</>)}


if(format==="figure"){

  return(
    <>
    
    {orcData && (
 
    <div class="space-y-2 pb-3">

      <div class="flex justify-center">
        <img width={200} src={orcData.image} alt={orcData.name} />
       </div>
       <div class="flex justify-center">
            <div class="font-semibold text-2xl ">{orcData.name}</div>
        </div>
    
       <div class="flex justify-center">
           <div class="font-semibold text-lg">Lvl: {orcData.calcLevel}</div>
       </div>
       <div class="flex justify-center">
           <div class="font-semibold text-xs text-center">{orcData.actionString} {showClaimable && `| ${claimable} Zug claimable`}</div>
       </div>
       <div class="flex justify-center">
           <div class="font-semibold text-xs">{`$Zug Bonus ${orcData.zugModifier}+`}</div>
       </div>
       </div>
       )}  
       
   
    </>
  )
}


if(format==="poofparts"){


  return(
<>
<div class="flex flex-wrap">


    {orcData && (

cleanExtract.map((image, i)=>{

  if(image !== null){
    return(<>
         
      <div>
      <img style={{imageRendering: 'pixelated' }} width={200} src={image} alt={orcData.name} />
      </div>
     

      </>)
  }

  
})
      
      )}

</div>
      </>
  )
}

if(format==="pfp"){


  return(
<>
    {orcData && (
      <>
         
      <div ref={pfpref}>
      <img class="rounded-full" src={orcData.image} alt={orcData.name} />
      </div>
      
      <div class="flex justify-evenly py-2">
      
      <button onClick={onpfpClick}>Download PNG</button>
      </div>
      </>
      )}
      </>
  )
}


if(format==="image"){

  return(
<>
    {orcData && (
      <>
         
      <div>
      <img  src={orcData.image} alt={orcData.name} />
      </div>
      

      </>
      )}
      </>
  )
}



return (
    <>
<div ref={ref} class="p2">

{orcData && (
<div class="space-y-2 pb-3">
  <div class="flex justify-center">
        <div class="font-semibold text-xl ">{orcData.name}</div>
    </div>
  <div class="flex justify-center">
    <img width={200} src={orcData.image} alt={orcData.name} />
   </div>

   <div class="flex justify-center">
       <div class="font-semibold text-xl">Lvl: {orcData.calcLevel}</div>
   </div>
   <div class="flex justify-center">
       <div class="font-semibold text-xs text-center">{orcData.actionString} {showClaimable && `| ${claimable} Zug claimable`}</div>
   </div>
   <div class="flex justify-center">
       <div class="font-semibold text-xs">{`$Zug Bonus ${orcData.zugModifier}+`}</div>
   </div>

   
   
   {allData && (
     <>
    <div class="text-sm">
    This orc is <strong>{orcData.actionString} </strong> and on the way to level <strong>{orcData.calcLevel}</strong>{showClaimable && ` with ${claimable} claimable.`}
    </div>
   
  
   </>
   )}
   
      {allData && orcData && (orcData.attributes.map((a, i)=>{

return(<div key={orcData.name + i}>
<div class="flex justify-between border-b-2">
<div class="text-sm capitalize">{a['trait_type'] /*//fix this laer */}</div> 
<div class="font-semibold text-sm">{a.value}</div>

</div>  
</div>)
}))}

{allData && <div class="break-all text-xs">Owner: {orcData.username && (`${orcData.username} | `) }{orcData.owner}</div> }
</div>


)}

</div>




{allData && orcData && (
<>
<div class="flex justify-evenly">

<button onClick={onButtonClick}>Download Stats PNG</button>
  </div>

<div>
<img ref={pfpref}  src={orcData.image} alt={orcData.name} />
</div>

  <div class="flex justify-evenly py-2">

<button onClick={onpfpClick}>Download PFP</button>
  </div>
</>
)}
</>
  )
}

export default Orc;
