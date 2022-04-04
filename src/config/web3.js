import Web3 from "web3";

import erc20ABI from "../assets/abi/erc20";
import hedgeFactoryABI from "../assets/abi/hedgeFactory";
import poolABI from "../assets/abi/pool";
import routerABI from "../assets/abi/router";

import {token_addresses, contract_addresses } from "./constants";

const provider = "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";


export const getTokenBalance = async (tokenAddr, account) => {
    const abi = erc20ABI[0];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, tokenAddr);
    let bal = await contract.methods["balanceOf"](account).call();
    let result = Number(web3.utils.fromWei(bal)).toFixed(2);
    if(Number(result) > 999)
        result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return result;
}

export const getPoolAddress = async (token1, token2) => {
    const abi = hedgeFactoryABI[0];
    const c_address = contract_addresses['hedgeFactory'];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, c_address);
    let result = await contract.methods["getPool"](token_addresses[token1], token_addresses[token2]).call();
    return result;
}

export const getPoolData = async (poolAddress) => {
    const abi = poolABI[0];
    const c_address = contract_addresses['pool'];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, c_address);
    contract.options.address = poolAddress;
    let result1 = await contract.methods["getPoolTokensAndBalances"]().call();
    let result2 = await contract.methods["getWeights"]().call();
    let result = { balances:result1['balances'], tokens:result1['tokens'], weights:result2 };
    return result;
}

export const swapTokens = async (provider, inTokenAddr, outTokenAddr, amount, account, limit) => {

    const abi = routerABI[0];
    const tokenAbi = erc20ABI[0];
    const c_address = contract_addresses['router'];
    const t_address = inTokenAddr;
    let web3 = new Web3(provider);

    const wei_amount = web3.utils.toWei(amount.toString());
    const wei_limit = web3.utils.toWei(limit.toString());
    let deadline = (new Date()).getTime()+900000;

    let contract = new web3.eth.Contract(abi, c_address);
    let token_contract = new web3.eth.Contract(tokenAbi, t_address);
    await token_contract.methods['increaseAllowance'](c_address, wei_amount).send({from: account});
    let result = await contract.methods["swap"]([ inTokenAddr, outTokenAddr, wei_amount ], [ account, account ], wei_limit, deadline).send({from: account});
}
