import Web3 from "web3";
import { ethers } from 'ethers';
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

export const getPoolAddress = async (token1Addr, token2Addr) => {
    const abi = hedgeFactoryABI[0];
    const c_address = contract_addresses['hedgeFactory'];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, c_address);
    let result = await contract.methods["getPool"](token1Addr, token2Addr).call();
    return result;
}

export const getPoolData = async (provider, poolAddress) => {
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

export const joinPool = async (account, provider, token1Addr, token2Addr, amount1, amount2) => {
    const abi = routerABI[0];
    const tokenAbi = erc20ABI[0];
    const c_address = contract_addresses['router'];
    let web3 = new Web3(provider);
    const poolAddr = await getPoolAddress(token1Addr, token2Addr);
    if(poolAddr) {
        const inAmount = web3.utils.toWei(amount1.toString());
        const inMaxAmount = web3.utils.toWei((amount1*1.2).toString());
        const outAmount = web3.utils.toWei(amount2.toString());
        const outMaxAmount = web3.utils.toWei((amount2*1.2).toString());
        const initUserData = ethers.utils.defaultAbiCoder.encode(
          ["uint256", "uint256[]", "uint256"],
          [
            1,
            //amounts In
            [inAmount, outAmount],
            //minimum amount of Lp tokens you are willing to accept
            web3.utils.toWei("0"),
          ]
        );

        let token1_contract = new web3.eth.Contract(tokenAbi, token1Addr);
        await token1_contract.methods['increaseAllowance'](c_address, inAmount).send({from: account});

        let token2_contract = new web3.eth.Contract(tokenAbi, token2Addr);
        await token2_contract.methods['increaseAllowance'](c_address, outAmount).send({from: account});

        let contract = new web3.eth.Contract(abi, c_address);
        let result = await contract.methods['joinPool'](account, [[token1Addr, token2Addr],[inMaxAmount, outMaxAmount], initUserData]).send({from: account});
        
        console.log(result);
    }
}

export const getPoolBalance = async (account, provider, poolAddr) => {
    const abi = poolABI[0];
    const c_address = contract_addresses['pool'];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, c_address);
    contract.options.address = poolAddr;
    const result = await contract.methods['balanceOf'](account).call();
    return web3.utils.fromWei(result);
}

export const removePool = async (account, provider, poolAddr, amount, amount1, amount2, token1Addr, token2Addr) => {

    const abi = routerABI[0];
    const tokenAbi = erc20ABI[0];
    const poolAbi = poolABI[0];
    const c_address = contract_addresses['router'];
    let web3 = new Web3(provider);

    const totalAmount = web3.utils.toWei(amount.toString())
    const inAmount = web3.utils.toWei(amount1.toString());
    const outAmount = web3.utils.toWei(amount2.toString());

    const initUserData = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint256"],
      [inAmount, outAmount]
    );

    let contract = new web3.eth.Contract(abi, c_address);

    // let token1_contract = new web3.eth.Contract(tokenAbi, token1Addr);
    // await token1_contract.methods['decreaseAllowance'](c_address, inAmount).send({from: account});

    // let token2_contract = new web3.eth.Contract(tokenAbi, token2Addr);
    // await token2_contract.methods['decreaseAllowance'](c_address, outAmount).send({from: account});
    const pc_address = contract_addresses['pool'];
    const owner = await contract.methods['owner']().call();
    let poolContract = new web3.eth.Contract(poolAbi, pc_address);
    poolContract.options.address = poolAddr;
    await poolContract.methods['allowance'](owner, c_address).send({from: account});

    let result = await contract.methods['exitPool'](account, [[token1Addr, token2Addr], [web3.utils.toWei("0"), web3.utils.toWei("0")], initUserData]).send({from: account});
}

export const fromWeiVal = (provider, val) => {
    let web3 = new Web3(provider);
    return web3.utils.fromWei(val);
}

// export const getAllPools = async () => {
//     const abi = hedgeFactoryABI[0];
//     const c_address = contract_addresses['hedgeFactory'];
//     let web3 = new Web3(provider);
//     let contract = new web3.eth.Contract(abi, c_address);
//     let result = await contract.methods["allPools"](1000000000000000).call();
//     return result;
// }

// export const exitPool = async () => {

// }