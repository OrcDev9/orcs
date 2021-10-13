import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";

function Orc({nftContract, tokenid}) {
 
const [orcData, setOrcData] = useState(null);
const [activities, setActivities] = useState(null);
const [activString, setActivString] = useState(null);
const [owner, setOwner] = useState(null);
const [levels, setLevels] = useState(null);
const [dateTime, setDateTime] = useState(null);
const [loading, setLoading] = useState(false);


useEffect(async () => {

  const lookupOrc = async ()=>{

    setLoading(true)
    let orcs = await nftContract.methods.orcs(tokenid).call()

    let a = await nftContract.methods.tokenURI(tokenid).call()
    var b = a.split(",")
    var c = JSON.parse(atob(b[1]))

    setOrcData(c)
    let activity = await nftContract.methods.activities(tokenid).call()
    setActivities(activity)

   let claimable = parseInt(await nftContract.methods.claimable(tokenid).call())
   let level = (parseInt(orcs.lvlProgress) + (claimable*3/2))/1000
   let level2 = (orcs.lvlProgress/1000).toFixed(2)

   
   
 
    let activitymap = null
    switch(parseInt(activity.action)) {
        case 1:
          activitymap = "farming"
          setLevels(level2)
          break;
        case 2:
          activitymap = "training"
          setLevels(level)
          break;
        default:
          activitymap = "doing nothing"
          setLevels(level2)
      }

      setActivString(activitymap)
      setOwner(activity.owner)
      setLoading(false)

  }

  lookupOrc()

 },[tokenid])



  return (
    <>
<div class="w-96 p-2 border-1 shadow">

{orcData && (
<div class="space-y-2 pb-3">
  <div class="flex justify-center">
    <img  width={250} src={orcData.image} alt={orcData.name} />
   </div>
   <div class="flex justify-center">
       <div class="font-semibold text-xl">{orcData.name}</div>
   </div>
   
   {activities && (<>
    <div class="text-sm">
    This orc is <strong>{activString} </strong> and on the way to level <strong>{levels}%</strong>
    </div>
    Owner:
   <div class="break-all text-xs">{owner}</div>
   </>)}
   
  
</div>


)}

{orcData && (orcData.attributes.map((a, i)=>{

    return(<div key={orcData.name + i}>
   <div class="flex justify-between">
   <div class="text-lg">{a.trait_type}</div> 
   <div class="font-semibold text-lg">{a.value}</div>

   </div>  
    </div>)
}))}



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
