import { useState, useEffect } from "react";
import { updateDatabase } from "./utils/services";
import { lookupOrc, getContract } from "./utils/interact"; 

function Orc({tokenid, allData}) {
 
const [orcData, setOrcData] = useState(null);
const [loading, setLoading] = useState(false);
const [showClaimable, setShowClaimable] = useState(false);
const [claimable, setClaimable] = useState(false);
 


useEffect(async () => {


const lookupsOrc = async ()=>{

    setLoading(true)
    
    let orcObj = await lookupOrc(tokenid)
    setOrcData(orcObj)

    setClaimable(((parseInt(orcObj.claimable))/Math.pow(10, 18)).toFixed(2))
    setShowClaimable(true)
    

   
    updateDatabase(orcObj) //update firestore eachtime someone looksup orc.
    console.log(orcObj)
  }

  lookupsOrc()


 },[tokenid])



  return (
    <>


<div class="p-2">

{orcData && (
<div class="space-y-2 pb-3">
<div class="flex justify-center">
       <div class="font-semibold text-xl ">{orcData.name}</div>
   </div>
  <div class="flex justify-center">
    <img  width={150} src={orcData.image} alt={orcData.name} />
   </div>

   <div class="flex justify-center">
       <div class="font-semibold text-xl">Lvl: {orcData.calcLevel}</div>
   </div>
   <div class="flex justify-center">
       <div class="font-semibold text-xs">{orcData.actionString} {showClaimable && `| ${claimable} Zug claimable`}</div>
   </div>
   <div class="flex justify-center">
       <div class="font-semibold text-xs">{`$Zug Bonus ${orcData.zugModifier}+`}</div>
   </div>

   
   
   {allData && (
     <>
    <div class="text-sm">
    This orc is <strong>{orcData.actionString} </strong> and on the way to level <strong>{orcData.calcLevel}</strong>{showClaimable && ` with ${claimable} claimable.`}
    </div>
   
   <div class="break-all text-xs">Owner: {orcData.owner}</div>
   </>
   )}
   
      {allData && orcData && (orcData.attributes.map((a, i)=>{

return(<div key={orcData.name + i}>
<div class="flex justify-between">
<div class="text-sm">{a['trait_type'] /*//fix this laer */}</div> 
<div class="font-semibold text-sm">{a.value}</div>

</div>  
</div>)
}))}

  
</div>


)}





</div>



</>
  )
}

export default Orc;


//////////////////////////////DATA RENDER FUNCTIONS - DATE TIME, TIMEAGO, MILLISECONDS, WINDOWS SIZE///////////////////////////////////
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];



export const getFormattedDate =  (date, prefomattedDate = false, hideYear = false) => {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    // Adding leading zero to minutes
    minutes = `0${ minutes }`;
  }

  if (prefomattedDate) {
    // Today at 10:20
    // Yesterday at 10:20
    return `${ prefomattedDate } at ${ hours }:${ minutes }`;
  }

  if (hideYear) {
    // 10. January at 10:20
    return `${ day }. ${ month } at ${ hours }:${ minutes }`;
  }

  // 10. January 2017. at 10:20
  return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
}


// --- Main function
export const timeAgo = (dateParam) => {
  if (!dateParam) {
    return null;
  }

  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
  const today = new Date();
  const yesterday = new Date(today - DAY_IN_MS);
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const isToday = today.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();
  const isThisYear = today.getFullYear() === date.getFullYear();


  if (seconds < 5) {
    return 'now';
  } else if (seconds < 60) {
    return `${ seconds } seconds ago`;
  } else if (seconds < 90) {
    return 'about a minute ago';
  } else if (minutes < 60) {
    return `${ minutes } minutes ago`;
  } else if (isToday) {
    return getFormattedDate(date, 'Today'); // Today at 10:20
  } else if (isYesterday) {
    return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
  } else if (isThisYear) {
    return getFormattedDate(date, false, true); // 10. January at 10:20
  }

  return getFormattedDate(date); // 10. January 2017. at 10:20
}
