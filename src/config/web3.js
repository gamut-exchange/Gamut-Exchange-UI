import Web3 from "web3";
import { ethers, BigNumber } from 'ethers';
import erc20ABI from "../assets/abi/erc20";
import hedgeFactoryABI from "../assets/abi/hedgeFactory";
import poolABI from "../assets/abi/pool";
import routerABI from "../assets/abi/router";
import faucetABI from "../assets/abi/faucet";

import { contractAddresses } from "./constants";

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
    const c_address = contractAddresses['hedgeFactory'];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, c_address);
    let result = await contract.methods["getPool"](token1Addr, token2Addr).call();
    return result;
}

export const getPoolData = async (provider, poolAddress) => {
    const abi = poolABI[0];
    const c_address = contractAddresses['pool'];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, c_address);
    contract.options.address = poolAddress;
    let result1 = await contract.methods["getPoolTokensAndBalances"]().call();
    let result2 = await contract.methods["getWeights"]().call();
    let result = { balances:result1['balances'], tokens:result1['tokens'], weights:result2 };
    return result;
}

export const tokenApproval = async (account, provider, tokenAddr) => {
    const routerAbi = routerABI[0];
    const tokenAbi = erc20ABI[0];
    const decimals = 18;
    const c_address = contractAddresses['router'];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(routerAbi, c_address);
    let tokenContract = new web3.eth.Contract(tokenAbi, tokenAddr);
    // const owner = await contract.methods['owner']().call();
    let remain = await tokenContract.methods['allowance'](account, c_address).call();
    remain = web3.utils.fromWei(remain);
    return remain;
}

export const approveToken = async (account, provider, tokenAddr, value) => {
    const c_address = contractAddresses['router'];
    const tokenAbi = erc20ABI[0];
    let web3 = new Web3(provider);
    let token_contract = new web3.eth.Contract(tokenAbi, tokenAddr);
    await token_contract.methods['increaseAllowance'](c_address, web3.utils.toWei(value.toString())).send({from: account});
    const result = await tokenApproval(account, provider, tokenAddr);
    return result;
}

export const poolApproval = async (account, provider, poolAddr) => {
    const poolAbi = poolABI[0];
    const c_address = contractAddresses['router'];
    const pc_address = contractAddresses['pool'];

    let web3 = new Web3(provider);

    let poolContract = new web3.eth.Contract(poolAbi, pc_address);
    poolContract.options.address = poolAddr;
    let remain = await poolContract.methods['allowance'](account, c_address).call();
    remain = web3.utils.fromWei(remain);
    return remain;
}

export const approvePool = async (account, provider, poolAddr, amount1, amount2) => {
    // const routerAbi = routerABI[0];
    const poolAbi = poolABI[0];
    const c_address = contractAddresses['router'];
    const pc_address = contractAddresses['pool'];

    let web3 = new Web3(provider);
    // let contract = new web3.eth.Contract(routerAbi, c_address);
    let poolContract = new web3.eth.Contract(poolAbi, pc_address);
    poolContract.options.address = poolAddr;
    await poolContract.methods['increaseAllowance'](c_address, web3.utils.toWei((Number(amount1)+Number(amount2)).toString())).send({from: account});
    const result = await poolApproval(account, provider, poolAddr);
    return result;
}


export const swapTokens = async (provider, inTokenAddr, outTokenAddr, amount, account, limit) => {

    const abi = routerABI[0];
    const c_address = contractAddresses['router'];
    let web3 = new Web3(provider);

    const wei_amount = web3.utils.toWei(amount.toString());
    const wei_limit = web3.utils.toWei(limit.toString());
    let deadline = (new Date()).getTime()+900000;

    let contract = new web3.eth.Contract(abi, c_address);
    let result = await contract.methods["swap"]([ inTokenAddr, outTokenAddr, wei_amount ], [ account, account ], wei_limit, deadline).send({from: account});
}

// export const batchSwapTokens = async (provider, inTokenAddr, outTokenAddr, amount, account, limit) => {
//     const usdtAddr = tokenAddresses['teth'];
//     if(inTokenAddr.toLowerCase() !== usdtAddr.toLowerCase() && outTokenAddr.toLowerCase() !== usdtAddr.toLowerCase()) {
//         const abi = routerABI[0];
//         const cAddress = contractAddresses['router'];
//         let web3 = new Web3(provider);

//         const wei_amount = web3.utils.toWei(amount.toString());
//         const wei_limit = web3.utils.toWei(limit.toString());
//         let deadline = (new Date()).getTime()+900000;

//         const funds = [account, account];

//         const swaps = [
//             [1, 2, wei_amount],
//             [2, 0, web3.utils.toWei("0")]
//         ];

//         const assets = [outTokenAddr, inTokenAddr, usdtAddr];

//         const limits = [
//           web3.utils.toWei("1000000"),
//           wei_amount,
//           web3.utils.toWei("100000"),
//         ];

//         let contract = new web3.eth.Contract(abi, cAddress);
//         let result = await contract.methods["batchSwap"](swaps, assets, funds, limits, deadline).send({from: account});       
//     } else {
//         console.log("can't swap usdt with batchSwap function.");
//     }
// }

export const joinPool = async (account, provider, token1Addr, token2Addr, amount1, amount2) => {
    const abi = routerABI[0];
    const tokenAbi = erc20ABI[0];
    const c_address = contractAddresses['router'];
    let web3 = new Web3(provider);
    const poolAddr = await getPoolAddress(token1Addr, token2Addr);
    if(poolAddr) {
        const inAmount = web3.utils.toWei(amount1.toString());
        const inMaxAmount = web3.utils.toWei((amount1*1.2).toString());
        const outAmount = web3.utils.toWei(amount2.toString());
        const outMaxAmount = web3.utils.toWei((amount2*1.2).toString());
        debugger;
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

        // let token1_contract = new web3.eth.Contract(tokenAbi, token1Addr);
        // await token1_contract.methods['increaseAllowance'](c_address, inAmount).send({from: account});

        // let token2_contract = new web3.eth.Contract(tokenAbi, token2Addr);
        // await token2_contract.methods['increaseAllowance'](c_address, outAmount).send({from: account});
        let contract = new web3.eth.Contract(abi, c_address);
        let result = await contract.methods['joinPool'](account, [[token1Addr, token2Addr],[inMaxAmount, outMaxAmount], initUserData]).send({from: account});
        
        console.log(result);
    }
}

export const getPoolBalance = async (account, provider, poolAddr) => {
    const abi = poolABI[0];
    const c_address = contractAddresses['pool'];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, c_address);
    contract.options.address = poolAddr;
    const result = await contract.methods['balanceOf'](account).call();
    return web3.utils.fromWei(result);
}

export const getPoolSupply = async (provider, poolAddr) => {
    const abi = poolABI[0];
    const c_address = contractAddresses['pool'];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, c_address);
    contract.options.address = poolAddr;
    const result = await contract.methods['totalSupply']().call();
    return web3.utils.fromWei(result);
}

export const removePool = async (account, provider, poolAddr, amount, ratio, token1Addr, token2Addr) => {

    const abi = routerABI[0];
    const tokenAbi = erc20ABI[0];
    const poolAbi = poolABI[0];
    const c_address = contractAddresses['router'];
    let web3 = new Web3(provider);

    const totalAmount = web3.utils.toWei(amount.toString());
    const tokenRatio = web3.utils.toWei(ratio.toString());
    console.log(tokenRatio);

    const initUserData = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint256"],
      [totalAmount, tokenRatio]
    );

    let contract = new web3.eth.Contract(abi, c_address);
    let result = await contract.methods['exitPool'](account, [[token1Addr, token2Addr], [web3.utils.toWei("0.001"), web3.utils.toWei("0.001")], initUserData]).send({from: account});
}

export const requestToken = async (account, provider, token) => {
    const abi = faucetABI[0];
    const faucet_addr = contractAddresses[token];
    let web3 = new Web3(provider);

    let contract = new web3.eth.Contract(abi, faucet_addr);
    await contract.methods['requestTokens']().send({from: account});
}

export const allowedToWithdraw = async (account, provider, token) => {
    const abi = faucetABI[0];
    const faucet_addr = contractAddresses[token];
    let web3 = new Web3(provider);

    let contract = new web3.eth.Contract(abi, faucet_addr);
    let allowed = contract.methods['allowedToWithdraw'](account).call();
    return allowed;
}

export const fromWeiVal = (provider, val) => {
    let web3 = new Web3(provider);
    return web3.utils.fromWei(val);
}
