import { useState, useEffect } from "react";
import React, { useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';

function OrcPFP({orc}) {

   
  //  <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`data:image/png;base64,${m}`}/>
  //  <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`data:image/png;base64,${o}`}/>

  var decodedImageStringAtoB = atob(orc.image.split(',')[1]);
  var extractImages = decodedImageStringAtoB.split(`xlink:href="`)
  var cleanExtract = extractImages.map((string)=>{
   
  if(string.includes(`data:image`)){
    var a = string.split(`"/>`)

    return(a[0])
  }

  return null
 
})

console.log(cleanExtract)

return (
    <>
<div style={{imageRendering: "pixelated"}} class="p2">

<svg id="orc" width={150} height={150} version="1.1" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${cleanExtract[1]}`}/>
    <image x="1" y="1" width="60" height="60" imageRendering="pixelated" preserveAspectRatio="xMidYMid" xlinkHref={`${cleanExtract[2]}`}/>
  
</svg>


</div>



</>
  )
}

export default OrcPFP;
