require('dotenv').config();
const Web3 = require("web3")

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const infuraKey = process.env.REACT_APP_INFURA_KEY;

///Alchemy and web3
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
//const web3 = createAlchemyWeb3(alchemyKey); 
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const web3 = new Web3(new Web3.providers.HttpProvider(infuraKey))

const orcs = require('../orcs-abi.json')
const zug = require('../zug-abi.json')
const ethWallet = "0x7d9d3659dcfbea08a87777c52020bc672deece13"
const nftContract = new web3.eth.Contract(orcs.abi, contractAddress);
const ercContract = new web3.eth.Contract(zug.abi, contractAddress);

const etherscanKey = process.env.REACT_APP_ETHERSCAN_KEY;
var api = require('etherscan-api').init(etherscanKey);


export const lookupOrc = async (tokenid)=>{

  let orcs = await nftContract.methods.orcs(tokenid).call()

  let a = await nftContract.methods.tokenURI(tokenid).call()
  var b = a.split(",")
  var orc = JSON.parse(atob(b[1]))

  let activity = await nftContract.methods.activities(tokenid).call()
  let claimable = parseInt(await nftContract.methods.claimable(tokenid).call())
  
  let level = ((parseInt(orcs.lvlProgress) + (claimable*3/2))/1000).toFixed(1)
  let level2 = (orcs.lvlProgress/1000).toFixed(1)
  let calcLevel

let activitymap = null
  switch(parseInt(activity.action)) {
      case 1:
        activitymap = "farming"
        calcLevel = level2
        break;
      case 2:
        activitymap = "training"
        calcLevel = level
        break;
      default:
        activitymap = "doing nothing"
        calcLevel = level2
    }

const  orcObj = {
      owner: activity.owner,
      tokenid: tokenid, 
      time: activity.timestamp,  
      action: activity.action,  
      actionString: activitymap,
      level:orcs.lvlProgress, 
      calcLevel: calcLevel,
      claimable: claimable,
      image: orc.image,
      name: orc.name,
      body: orcs.body,
      helm: orcs.helm,
      mainhand: orcs.mainhand,
      offhand: orcs.offhand,
      zugModifier: orcs.zugModifier,    
      attributes: orc.attributes
    }

    return(orcObj)

}


///////////OLD

export function getContract(){
    
    return {nftContract, ercContract, web3}
  }

export async function getContractPrice(){
  const res = await nftContract.methods.getPrice().call();  
  return web3.utils.fromWei(res)
}


export const getContractAddress = () => {
  return(contractAddress)
  }

export const tokensByOwner = async (address) => {
var supply = nftContract.methods.tokensByOwner(address).call();
return(supply)
}

export const ownerOf = async (token) => {
  var address = nftContract.methods.ownerOf(token).call();
  return(address)
  }

export const getTokenSupply = async () => {
  var supply = nftContract.methods.totalSupply().call();
  return(supply)
  }
  

  export const isSaleActive = async () => {
    var sale = nftContract.methods.isSaleActive().call();
    return(sale)
    }

export const getEthPrice = async () => {
  var price = api.stats.ethprice();
  return(price)
}

export const getGasPrice = async () => {
  const gasApi = fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${etherscanKey}`, {method: "GET"})
  const response = (await gasApi).json()
  return(response)
}



export const getTxReceipt = async (txHash) => {
  var ret = api.proxy.eth_getTransactionReceipt(txHash); 
  return(ret)
}

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "Wallet connected...",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a rel="noreferrer" target="_blank" href={`https://metamask.app.link/dapp/hilarioushuskies.life/`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a rel="noreferrer" target="_blank" href={`https://metamask.app.link/dapp/hilarioushuskies.life/`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  
export const mintNFT = async() => {
  
    const nonce = await web3.eth.getTransactionCount(window.ethereum.selectedAddress, 'latest'); //get latest nonce
   
    //the transaction
    const tx = {
      'from': window.ethereum.selectedAddress,
      'to': contractAddress,
      'nonce': nonce.toString(),
      'data': nftContract.methods.mint().encodeABI()
    };
  
   
    //sign the transaction via Metamask
 try {
    const txHash = await window.ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [tx],
        })
        
    
        
    return {
        success: true,
        status: (<>✅ Check out your transaction on <a target="_blank" href={`https://etherscan.io/tx/${txHash}`}>Etherscan</a> </>),
        txHash: txHash
        

    }
 } catch (error) {
    return {
        success: false,
        status: "😥 Something went wrong: " + error.message + " Try reloading the page..."
    }

 }

  }

  /*

  export const collect_zug =() =>{
    var temp = [];
    for(var i=0;i<this.Orcs.length;i++){
      if(await this.contract_service.contract.methods.claimable(this.Orcs[i].id).call().then()>0){
        temp.push(this.Orcs[i].id);
      }
    }

    var func = {"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"claim"};

    var tx = await this.contract_service.buildTransaction(this.contract_service.current_account,func,[temp]);

    
    this.contract_service.send_transaction(tx);

    this.collectable_zug.next(0);
  }

}
  */

  export const doAction = async(action, id) => {
  
    const nonce = await web3.eth.getTransactionCount(window.ethereum.selectedAddress, 'latest'); //get latest nonce
   
    //the transaction
    const tx = {
      'from': window.ethereum.selectedAddress,
      'to': contractAddress,
      'nonce': nonce.toString(),
      'data': nftContract.methods.doAction(id, action).encodeABI()
    };
  
   
    //sign the transaction via Metamask
 try {
    const txHash = await window.ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [tx],
        })
        
    
        
    return {
        success: true,
        status: (<>✅ Check out your transaction on <a target="_blank" href={`https://etherscan.io/tx/${txHash}`}>Etherscan</a> </>),
        txHash: txHash
        

    }
 } catch (error) {
    return {
        success: false,
        status: "😥 Something went wrong: " + error.message + " Try reloading the page..."
    }

 }

  }
  
