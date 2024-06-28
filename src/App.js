import React, {Component} from 'react'
import Web3 from 'web3'
import VotingAbi from './contractsData/Voting.json'
import VotingAddress from './contractsData/Voting-address.json'

class App extends Component {
    componentWillMount(){
        this.loadBlockchainData()
    }

async loadBlockchainData(){
    console.log('VotingAddress.address', VotingAddress.address)
    console.log('VotingAbi.abi', VotingAbi.abi)
    let NewHelloAbi = require('./contractsData/Voting.json');
    const web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-35-164-183-115.us-west-2.compute.amazonaws.com:8545"))
    var account;
    const accounts  = await web3.eth.getAccounts()
    console.log(accounts)
    web3.eth.getAccounts().then((f) => {
        account = f[0];
    })

    this.setState( { account : accounts[0] })
    console.log(account);
    const contract = new web3.eth.Contract(VotingAbi.abi);
    contract.options.address = VotingAddress.address
    this.setState( { contract })
    let myCandidateList = await  contract.methods.getCandidateList().call();  
    console.log(myCandidateList);   
//const number = await contract.methods.totalVotesFor('Johnny').call(console.log)
  //  console.log("Johnny number: ", number)    
    var count = await this.state.contract.methods.totalVotesFor('Johnny').call(console.log);
    
        this.setState( { Johnny: parseInt(count) } )


	count = await this.state.contract.methods.totalVotesFor('Amber').call(console.log);

        this.setState( { Amber : parseInt(count) } )

}
    constructor(props){
        super(props)
        console.log("constructor")
        this.state = {
            account: '',
            loading: true,
            message: ''
        }
     this.voting = this.voting.bind(this)

    }
    voting = async (name) =>  {
        this.state.contract.methods.voteForCandidate(name).send({gas: 140000, from: this.state.account });
        var count = await this.state.contract.methods.totalVotesFor(name).call(console.log);
        this.setState( { [name]: parseInt(count) } )
 }


render(){

        return (
                <div>
                <div>
                 <button onClick={() => this.voting("Johnny")}>Johnny vote</button>
                 <button onClick={() => this.voting("Amber")}>Amber vote</button>

		</div>

                <h5>Johnny count: {this.state.Johnny}</h5>
                <h5>Amber count: {this.state.Amber}</h5>

		</div>
        );
}
}

export default App;
