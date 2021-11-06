import { useState, useEffect } from "react";
import React, { useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';
import {
    getGasPrice, getEthPrice, getContract, getContractEvents, lookupAllOrcs, lookupMultipleOrcs
    } from "./utils/interact.js";
import Orc from "./Orc"
import Title from "./Title.js";

function OrcPFP({orc}) {

    const [myOrcs, setMyorcs] = useState();    
    const [orcImage, setOrcImage] = useState();    
    const [showOrc, setShowOrc] = useState(false);
    const [orcId, setOrcId] = useState();    
    const orcLookupRef = useRef();
  //  <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`data:image/png;base64,${m}`}/>
  //  <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`data:image/png;base64,${o}`}/>
  const ref = useRef()

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `Orcpfp.png`
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  const handleOrcSubmit = async (e) => {
      
    e.preventDefault()
    setShowOrc(false)
    const value = orcLookupRef.current.value;
    const t = parseInt(value) 
    let tempArr = [] 
    tempArr.push(t) 
  
    if((t > 0) && (t < 5051)){
      let multiOrcs = await lookupMultipleOrcs({array: tempArr})
      console.log(multiOrcs, tempArr)
      setMyorcs(multiOrcs)
      setShowOrc(true)

      var decodedImageStringAtoB = atob(multiOrcs[0].image.split(',')[1]);
      var extractImages = decodedImageStringAtoB.split(`xlink:href="`)
      var cleanExtract = extractImages.map((string)=>{
       
      if(string.includes(`data:image`)){
        var a = string.split(`"/>`)
    
        return(a[0])
      }
    
      return null
     
    })
    setOrcImage(cleanExtract)

    }

  
      
  };

 


return (
    <>
    <Title text={"ORC PFP"} />
      <div class="flex flex-wrap justify-center">
        <form onSubmit={handleOrcSubmit}>
        <input  placeholder={"Type Orc Id here"} ref={orcLookupRef} />
        <button class="hidden" type="submit">Unleash the Orc</button> 
        </form>    
      </div>  
{orcImage &&
(
<div ref={ref} style={{imageRendering: "pixelated"}} class="p2">

<svg class="rounded-full" id="orc" width={300} height={300} version="1.1" viewBox="13 3 30 40" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[1]}`}/>
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[2]}`}/>
  
</svg>


</div>
)}

{orcImage &&(

<div class="flex justify-evenly">
<button onClick={onButtonClick}>Download PFP</button>
</div>
)}

</>
  )
}

export default OrcPFP;
