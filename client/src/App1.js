import React, { Component } from "react";
import ItemManager from "./contracts/ItemManager.json";
import Item from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { cost: 0, itemName: "item1", loaded:false};
  componentDidMount = async () => {
    // Get network provider and web3 instance./
 //
 this.web3 = await getWeb3();
 
 
 this.accounts = await this.web3.eth.getAccounts();
 const networkId = await this.web3.eth.net.getId();
 
 this.itemManager = new this.web3.eth.Contract(
    ItemManager.abi,
    ItemManager.networks[networkId] &&
    ItemManager.networks[networkId].address,
 );
 
 this.item = new this.web3.eth.Contract(
 Item.abi,
 Item.networks[networkId] && Item.networks[networkId].address,
 
 );
 this.listenToPaymentEvent();
 this.setState({loaded:true});
 }

   handleSubmit = async () =>{

   const {cost, itemName} = this.state;
   console.log(itemName, cost, this.itemManager);
   let result = await this.itemManager.methods.createItem(itemName, cost).send({from: this.accounts[0]});
   console.log(result);

   alert("Send" + cost + "Wei to" + result.events.SupplyChainStep.returnValues._address);
   }
   handleInputChange = (event) => {
   
   const target = event.target;
   const value = target.type === 'checkbox' ? target.checked : target.value;
   const name = target.name;
   this.setState({
   [name]:value
   });

}
   listenToPaymentEvent = () =>{
                           
   let self = this;
   this.itemManager.events.SupplyChainStep().on("data", async function(evt){

   if(evt.returnValues._step === 1){
   
      let item = 
         await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
      console.log(item);
      alert("item "+ item._identifier +" was paid, deliver it now!")
      };
   console.log(evt);
   }

   )}


  

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Nicoarkano First Dapp!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
