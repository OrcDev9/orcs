
import { db } from "../initFirebase";
import { getDatabase, ref, set, onValue, query, get,child, orderByValue, push, orderByChild, limitToLast} from "firebase/database";

export const updateDatabase = async (orc) => {
      
    const orcDataref = ref(db, 'orcs/' + orc.tokenid)
    
      await set(orcDataref, {
        owner: orc.owner,
        action: orc.action,
        tokenid: orc.tokenid,
        claimable: orc.claimable,
        level: orc.level,
        time: orc.time,
        body: orc.body,
        helm: orc.helm,
        mainhand: orc.mainhand,
        offhand: orc.offhand,
        totalZug: (4 + parseInt(orc.zugModifier))
  
      });   
  
  }

export const getOrcfromDb = async () => {

const OrcDisplayRef = query(ref(db, 'orcs'), limitToLast(100));
let obj

    onValue(OrcDisplayRef, (snapshot) =>{

        obj = snapshot.val();
        
         
       })
       
  return(obj)
  }