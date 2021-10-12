import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";

function Orc({nftContract, tokenid}) {
 
const [orcData, setOrcData] = useState(null);


useEffect(async () => {

    let a = await nftContract.methods.tokenURI(tokenid).call()

    var b = a.split(",")
    var c = JSON.parse(atob(b[1]))

    setOrcData(c)
    console.log(c)
    

 },[tokenid])

  return (
<div class="w-80 p-2 border-1 shadow">

{orcData && (
<div class="space-y-2 pb-3">
  <div class="flex justify-center">
    <img  width={250} src={orcData.image} alt={orcData.name} />
   </div>
   <div class="flex justify-center">
       <div class="font-semibold text-xl">{orcData.name}</div>
   </div>
</div>
  

)}

{orcData && (orcData.attributes.map((a)=>{

    return(<>
   <div class="flex justify-between">
   <div class="text-lg">{a.trait_type}</div> 
   <div class="font-semibold text-lg">{a.value}</div>

   </div>  
    </>)
}))}



</div>


  );
}

export default Orc;


