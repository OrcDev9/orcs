
import { db } from "../initFirebase";
import { getDatabase, ref, set, onValue, query, get,child, equalTo, orderByValue, push, orderByChild, limitToLast} from "firebase/database";

export const updateDatabase = async (orc) => {
      
    const orcDataref = ref(db, 'orcs/' + orc.tokenid)
    
      await set(orcDataref, {
        owner: orc.owner,
        action: orc.action,
        actionString: orc.actionString,
        tokenid: parseInt(orc.tokenid),
        claimable: orc.claimable,
        level: orc.level,
        calcLevel: orc.calcLevel,
        time: orc.time,
        body: orc.body,
        helm: orc.helm,
        mainhand: orc.mainhand,
        offhand: orc.offhand,
        totalZug: (4 + parseInt(orc.zugModifier)),
        attributes: orc.attributes
  
      });   

      console.log(`Updated Orc #${orc.tokenid} metadats`)
  
  }

export const getMyOrcsObject = async (address) => {

  const myOrcQuery = query(ref(db, 'orcs'), orderByChild('owner'), equalTo(address)) ///"0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"));
    
    let dataArry = []

    onValue(myOrcQuery, (snapshot) =>{
      if(snapshot.exists()){

        Object.entries(snapshot.val()).forEach(([key, value])=>{
        
          dataArry.push({tokenId:value.tokenid})
                   
        })
        console.log("Got My Orcs. Orc of them", address, dataArry)   
      }else{
        console.log("Got No Orcs. NOrc of them", address) 
      }
      
            
            },{
            onlyOnce: true
                  }
            )
            
    
        
      
           return(dataArry) 
    
    };
    

export const getOrcfromDb = async () => {

const OrcDisplayRef = query(ref(db, 'orcs'), limitToLast(100));
let obj

    onValue(OrcDisplayRef, (snapshot) =>{

        obj = snapshot.val();
        
         
       })
       
  return(obj)
  }