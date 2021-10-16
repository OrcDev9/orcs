import React, { useState, useEffect } from "react";
import { db } from "./initFirebase";
import { getDatabase, ref, set, onValue, query, get,child, equalTo, orderByValue, push, orderByChild, limitToFirst, limitToLast, startAt, endAt} from "firebase/database";

import Orc from "./Orc";

const MyOrcs = ({web3}) => {

const [myOrcs, setMyOrcs] = useState();




const wallet4 = "0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"

const init = async (acc) => {

  console.log(acc)

const myOrcQuery = query(ref(db, 'orcs'), orderByChild('owner'), equalTo(acc)) ///"0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"));

let dataArry = []
    onValue(myOrcQuery, (snapshot) =>{

        Object.entries(snapshot.val()).forEach(([key, value])=>{
    
            dataArry.push({tokenId:value.tokenid, 
                                  
                          })
                         
          });
  
      
      setMyOrcs(dataArry)
  
    })
  
        

};

useEffect(async () => {

    const accounts = await web3.eth.getAccounts();
console.log(accounts)
     init(accounts[0])



}, [0]);







return (
    <>

<h2>My Orcs</h2>
<div class="flex flex-wrap space-x-6">


{myOrcs && myOrcs.map((orc, index)=>{
    return(<Orc key={index} tokenid={parseInt(orc.tokenId)} />)
})}
</div>
    </>
  );
};

export default MyOrcs;
