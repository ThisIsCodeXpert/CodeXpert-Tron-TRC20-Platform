import React from 'react';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
import Utils from 'utils';
import Swal from 'sweetalert2';

import './App.scss';

const FOUNDATION_ADDRESS = 'TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            getbalanceaddress: '',
            transferaddress: '',
            transferamount: '',
            contractAddress:'',
            tokenname:'',
            tokensymbol:'',
            tronwebaddress:'',
            totalSupply:'',
            burnamount:'',
            transferfromfromaddress:'',
            transferfromtoaddress:'',
            transferfromamount:'',
            approvespender:'',
            approveamount:'',
            burnfromfrom:'',
            burnfromamount:'',


              tronWeb: {
                  installed: false,
                  loggedIn: false
              },
            }
        this.updateGetBalanceInputValue = this.updateGetBalanceInputValue.bind(this)
        this.updateTransferInputValue = this.updateTransferInputValue.bind(this)
        this.updateTransferAmountInputValue = this.updateTransferAmountInputValue.bind(this)
        this.updateContractAddressInput = this.updateContractAddressInput.bind(this)
        this.updateBurnAmountInputValue = this.updateBurnAmountInputValue.bind(this)
        this.updateTansferFromFromInputValue = this.updateTansferFromFromInputValue.bind(this)
        this.updateTansferFromToInputValue = this.updateTansferFromToInputValue.bind(this)
        this.updateTansferFromAmountInputValue = this.updateTansferFromAmountInputValue.bind(this)
        this.updateApproveSpender = this.updateApproveSpender.bind(this)
        this.updateApproveValue = this.updateApproveValue.bind(this)
        this.updateBurnFromFromValue = this.updateBurnFromFromValue.bind(this)
        this.updateBurnFromAmountValue = this.updateBurnFromAmountValue.bind(this)

    }

    async componentDidMount() {

        this.setState({loading:true})
        await new Promise(resolve => {
            const tronWebState = {
                installed: !!window.tronWeb,
                loggedIn: window.tronWeb && window.tronWeb.ready
            };

            if(tronWebState.installed) {
                this.setState({
                    tronWeb:
                    tronWebState
                });

                return resolve();
            }

            let tries = 0;

            const timer = setInterval(() => {
                if(tries >= 10) {
                    const TRONGRID_API = 'https://api.trongrid.io';

                    window.tronWeb = new TronWeb(
                        TRONGRID_API,
                        TRONGRID_API,
                        TRONGRID_API
                    );

                    this.setState({
                        tronWeb: {
                            installed: false,
                            loggedIn: false
                        }
                    });

                    clearInterval(timer);
                    return resolve();
                }

                tronWebState.installed = !!window.tronWeb;
                tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

                if(!tronWebState.installed)
                    return tries++;

                this.setState({
                    tronWeb: tronWebState
                });

                resolve();
            }, 100);
        });

        if(!this.state.tronWeb.loggedIn) {
            // Set default address (foundation address) used for contract calls
            // Directly overwrites the address object as TronLink disabled the
            // function call
            window.tronWeb.defaultAddress = {
                hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
                base58: FOUNDATION_ADDRESS
            };

            window.tronWeb.on('addressChanged', () => {
                if(this.state.tronWeb.loggedIn)
                    return;

                this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true
                    }
                });
            });
        }


        //await Utils.setTronWeb(window.tronWeb);
        //console.log(Utils.tronWeb.address.fromHex((((await Utils.tronWeb.trx.getAccount()).address).toString())));  /////// Get account address and info
       // console.log(await Utils.tronWeb.trx.getBalance());
    }

    ///////////////////////////////// DYNAMIC CONTRACT ADDRESS /////////////////////////
    async updateContractAddressInput (evt) {
            await this.setState({
              contractAddress: evt.target.value
            });
            console.log('contractAddress : ', this.state.contractAddress);
            await Utils.setTronWeb(window.tronWeb, this.state.contractAddress);
            //const tmp_name = await Utils.contract.name().call();
            const tmp_tronwebaddress = Utils.tronWeb.address.fromHex((((await Utils.tronWeb.trx.getAccount()).address).toString()));
            await this.setState({
              tokenname : await Utils.contract.name().call(),
              tokensymbol : await Utils.contract.symbol().call(),
              totalSupply : ((await Utils.contract.totalSupply().call()).toNumber())/100000000,
              tronwebaddress:tmp_tronwebaddress
            });

    }
    ///////////////////////////////// DYNAMIC CONTRACT ADDRESS END /////////////////////////

    /////////////////////////////////////// GET BALANCE /////////////////////////////////
    async getBalance(_getbalanceaddress){
        const balance = ((await Utils.contract.balanceOf(_getbalanceaddress).call()).toNumber())/100000000;
        //const balance = await Utils.contract.decimals().call();
        console.log('balance', balance);

            this.setState({balance:balance})

    }
    updateGetBalanceInputValue (evt) {
        console.log('getbalanceaddress : ', this.state.getbalanceaddress);
            this.setState({
              getbalanceaddress: evt.target.value
            });
    }
    /////////////////////////////////////// GET BALANCE END /////////////////////////////////

    /////////////////////////////////// TRANSFER /////////////////////////////
    Transfer(_to, _amount){

        Utils.contract.transfer(_to, _amount).send({
            shouldPollResponse: true,
            callValue: 0
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'

        }));

    }

    updateTransferInputValue (evt) {
        this.setState({
          transferaddress: evt.target.value
        });
    console.log('transferaddress : ', this.state.transferaddress);

    }

    updateTransferAmountInputValue (evt) {
        console.log('transferamount : ', this.state.transferamount);
            this.setState({
              transferamount: evt.target.value
            });
    }
    /////////////////////////////////// TRANSFER END /////////////////////////////


    /////////////////////////////  TRANSFER FROM ///////////////////////////////////

    async TransferFrom(_from, _to, _amount){

            const allowance = await Utils.contract.allowance(_from, this.state.tronwebaddress).call();
            console.log('allowance : ', allowance);

            Utils.contract.transferFrom(_from, _to, _amount).send({
                shouldPollResponse: true,
                callValue: 0
            }).then(res => Swal({
                title:'Transfer Successful',
                type: 'success'
            })).catch(err => Swal({
                title:'Transfer Failed',
                type: 'error'

            }));

        }

        updateTansferFromFromInputValue (evt) {

                this.setState({
                  transferfromfromaddress: evt.target.value
                });

                console.log('transferfromfromaddress : ', this.state.transferfromfromaddress);
        }

        updateTansferFromToInputValue (evt) {

                this.setState({
                  transferfromtoaddress: evt.target.value
                });
                console.log('transferfromtoaddress : ', this.state.transferfromtoaddress);
        }

        updateTansferFromAmountInputValue (evt) {

                this.setState({
                  transferfromamount: evt.target.value
                });

                console.log('transferfromamount : ', this.state.transferfromamount);
        }


    /////////////////////////////  TRANSFER FROM END ///////////////////////////////////


    //////////////////////////////////// APPROVE ////////////////////////////
    Approve(_spender, _amount){

                   Utils.contract.approve(_spender, _amount).send({
                       shouldPollResponse: true,
                       callValue: 0
                   }).then(res => Swal({
                       title:'Approval Successful',
                       type: 'success'
                   })).catch(err => Swal({
                       title:'Approval Failed',
                       type: 'error'

                   }));
    }

    updateApproveValue (evt) {

            this.setState({
              approveamount: evt.target.value
            });
            console.log('approveamount : ', this.state.approveamount);
    }

    updateApproveSpender (evt) {

            this.setState({
              approvespender: evt.target.value
            });

            console.log('approvespender : ', this.state.approvespender);
    }



    //////////////////////////////////// APPROVE END ////////////////////////////

    /////////////////////////// BURN /////////////////////////////////

    Burn(_amount){

        Utils.contract.burn(_amount).send({
            shouldPollResponse: true,
            callValue: 0
        }).then(res => Swal({
            title:'Burn Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Burn Failed',
            type: 'error'

        }));

    }

    updateBurnAmountInputValue (evt) {
        console.log('burnamount : ', this.state.burnamount);
            this.setState({
              burnamount: evt.target.value
            });
    }
    /////////////////////////// BURN END /////////////////////////////////


    /////////////////////////// BURN FROM /////////////////////////////////

    BurnFrom(_from, _amount){

        Utils.contract.burnFrom(_from, _amount).send({
            shouldPollResponse: true,
            callValue: 0
        }).then(res => Swal({
            title:'Burn Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Burn Failed',
            type: 'error'

        }));

    }

    updateBurnFromAmountValue (evt) {
        console.log('burnfromamount : ', this.state.burnfromamount);
            this.setState({
              burnfromamount: evt.target.value
            });
    }

    updateBurnFromFromValue (evt) {
        console.log('burnfromfrom : ', this.state.burnfromfrom);
            this.setState({
              burnfromfrom: evt.target.value
            });
    }

    /////////////////////////// BURN FROM END /////////////////////////////////






    render() {
        if(!this.state.tronWeb.installed)
            return <TronLinkGuide />;

        if(!this.state.tronWeb.loggedIn)
            return <TronLinkGuide installed />;

        return (
              <div className='row'>
                <div className='col-lg-12 text-center' >
                  <hr/>

                      <div className="topnav">
                        <img src={'CodeXpert.png'}  width="200px"/>
                      </div>
                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>

                  <h1 style={{color : 'white' }}>Tron TRC20 Token Management Platform</h1>
                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>
                  <p> Your Address : {this.state.tronwebaddress} </p>
                  <br/>
                  <br/>









                  <p> Paste your contract address here : </p>
                  <input style={{ width:"400px" }} value={this.state.contractAddress} onChange={this.updateContractAddressInput}/>
                  <br/>
                  <p> Token name : {this.state.tokenname}</p>
                  <p> Token Symbol : {this.state.tokensymbol}</p>
                  <p> Total Supply : {this.state.totalSupply}</p>
                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>










                  <br/>
                  <br/>
                  <input style={{ width:"400px" }} value={this.state.getbalanceaddress} onChange={this.updateGetBalanceInputValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-primary' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.getBalance(this.state.getbalanceaddress)
                                                                     }  }>Get Balance
                  </button>
                  <br/>
                  <br/>
                  <p>Your balance is : {this.state.balance}</p>
                  <br/>











                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>
                  <br/>
                  <p> To : </p>
                  <input style={{ width:"400px" }} value={this.state.transferaddress} onChange={this.updateTransferInputValue}/>
                  <p> Amount : </p>
                  <input style={{ width:"200px" }} value={this.state.transferamount} onChange={this.updateTransferAmountInputValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-primary' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.Transfer(this.state.transferaddress, this.state.transferamount*100000000)
                                                                     }  }>Transfer
                  </button>
                  <br/>








                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>
                  <br/>
                  <p> From : </p>
                  <input style={{ width:"400px" }} value={this.state.transferfromfromaddress} onChange={this.updateTansferFromFromInputValue}/>
                  <p> To : </p>
                  <input style={{ width:"400px" }} value={this.state.transferfromtoaddress} onChange={this.updateTansferFromToInputValue}/>
                  <p> Amount : </p>
                  <input style={{ width:"200px" }} value={this.state.transferfromamount} onChange={this.updateTansferFromAmountInputValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-primary' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.TransferFrom(this.state.transferfromfromaddress, this.state.transferfromtoaddress, this.state.transferfromamount*100000000)
                                                                     }  }>Transfer From
                  </button>
                  <br/>











                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>
                  <br/>
                  <p> Spender : </p>
                  <input style={{ width:"400px" }} value={this.state.approvespender} onChange={this.updateApproveSpender}/>
                  <p> Amount : </p>
                  <input style={{ width:"400px" }} value={this.state.approveamount} onChange={this.updateApproveValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-primary' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.Approve(this.state.approvespender, this.state.approveamount*100000000)
                                                                     }  }>Approve
                  </button>
                  <br/>











                  <br/>
                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>
                  <br/>
                  <p> Amount to burn : </p>
                  <input style={{ width:"200px" }} value={this.state.burnamount} onChange={this.updateBurnAmountInputValue}/>
                  <br/>
                  <br/>
                  <button className='btn btn-primary' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.Burn(this.state.burnamount*100000000)
                                                                     }  }>Burn
                  </button>
                  <br/>
                  <br/>










                  <br/>
                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>
                  <br/>
                  <p> From : </p>
                  <input style={{ width:"200px" }} value={this.state.burnfromfrom} onChange={this.updateBurnFromFromValue}/>
                  <p> Amount to burn : </p>
                  <input style={{ width:"200px" }} value={this.state.burnfromamount} onChange={this.updateBurnFromAmountValue}/>

                  <br/>
                  <br/>
                  <button className='btn btn-primary' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.BurnFrom(this.state.burnfromfrom, this.state.burnfromamount*100000000)
                                                                     }  }>Burn From
                  </button>
                  <br/>
                  <br/>










                  <br/>
                  <br/>
                </div>
              </div>
        );
    }
}

export default App;

