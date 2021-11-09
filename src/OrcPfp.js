import { useState, useEffect } from "react";
import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import Title from "./Title.js";

function OrcPFP({orc}) {

    

  //  <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`data:image/png;base64,${m}`}/>
  //  <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`data:image/png;base64,${o}`}/>
  const [orcImage, setOrcImage] = useState();    
  const ref0 = useRef()
  const ref1 = useRef()
  const ref2 = useRef()

  const onButtonClick = (refIndex)=>{
  let refs = [ref0, ref1, ref2]
  console.log(refIndex, refs[refIndex].current)

    toPng(refs[refIndex].current, { cacheBust: true, })
    .then((dataUrl) => {
      const link = document.createElement('a')
      link.download = `Orcpfp.png`
      link.href = dataUrl
      link.click()
    })
    .catch((err) => {
      console.log(err)
    })

  }

  useEffect(() => {
    
if(orc){
    var decodedImageStringAtoB = atob(orc.image.split(',')[1]);
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
 
  }, [orc])
 

 


return (
    <>

{orcImage &&
(
<div class="flex flex-wrap">
<div style={{imageRendering: "pixelated"}} class="p2 w-1/3">

<svg ref={ref0} class="rounded-full" id="orc" width={300} height={300} version="1.1" viewBox="13 3 30 40" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[1]}`}/>
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[2]}`}/>
  
</svg>

<div class="flex justify-evenly pt-4">
<button onClick={()=>{onButtonClick(0)}}>Download</button>
</div>
</div>
<div style={{imageRendering: "pixelated"}} class="p2 w-1/3">

<svg ref={ref1} class="rounded-full" id="orc" width={300} height={300} version="1.1" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[1]}`}/>
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[2]}`}/>
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[3]}`}/>
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[4]}`}/>
</svg>

<div class="flex justify-evenly pt-4">
<button onClick={()=>{onButtonClick(1)}}>Download</button>
</div>
</div>
<div style={{imageRendering: "pixelated"}} class="p2 w-1/3">

<svg ref={ref2} id="orc" width={300} height={300} version="1.1" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[1]}`}/>
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[2]}`}/>
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[3]}`}/>
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${orcImage[4]}`}/>  
</svg>

<div class="flex justify-evenly pt-4">
<button onClick={()=>{onButtonClick(2)}}>Download</button>
</div>

</div>
</div>

)}


</>
  )
}

export default OrcPFP;
