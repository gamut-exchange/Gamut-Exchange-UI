import React, { useState, useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { useWeb3React } from "@web3-react/core";
import Modal from "@mui/material/Modal";
import Button from '@mui/material/Button';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import tw, { styled } from "twin.macro";
import { uniList }  from "../../config/constants";
import { requestToken, allowedToWithdraw } from "../../config/web3";

const Faucet = () => {
  const selected_chain = useSelector((state) => state.selectedChain);
  const { account, connector } = useWeb3React();
  const [chain, setChain] = useState(selected_chain);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = useState("");
  const [selectedToken, setSelectedToken] = useState(uniList[selected_chain][0]);
  const [filterData, setFilterData] = useState(uniList[selected_chain].filter((item, index) => { return index != 0;}));
  const [allowed, setAllowed] = useState(true);

  const dispatch = useDispatch();

  const StyledModal = tw.div`
    flex
    flex-col
    absolute
    top-1/4 left-1/3
    bg-white-bg
    p-6
    shadow-box overflow-y-scroll
    min-h-min
    transform -translate-x-1/2 -translate-y-1/2
    w-1/3
  `;

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const filterToken = (e) => {
    let search_qr = e.target.value;
    setQuery(search_qr);
    if(search_qr.length != 0) {
      const filterDT = uniList[chain].filter((item) => {
        return item['symbol'].toLowerCase().indexOf(search_qr) != -1
      });
      setFilterData(filterDT);
    } else {
      setFilterData(uniList[chain]);
    }
  }

  const selectToken = async (item) => {
    handleClose();
    setSelectedToken(item);
    let filterData = uniList[chain].filter(token => {
      return token['address'] != item['address'];
    });
    setFilterData(filterData);
    const provider = await connector.getProvider();
    const fau_allowed = await allowedToWithdraw(account, provider, item['symbol'].toLowerCase(), chain);
    setAllowed(fau_allowed);
  }

  const requestTToken = async () => {
    const provider = await connector.getProvider();
    debugger;
    await requestToken(account, provider, selectedToken['symbol'].toLowerCase(), chain);
    const fau_allowed = await allowedToWithdraw(account, provider, selectedToken['symbol'].toLowerCase(), chain);
    setAllowed(fau_allowed);
  }

  useEffect(() => {
    if(account) {
        const getInfo = async () => {
        const provider = await connector.getProvider();
        const fau_allowed = await allowedToWithdraw(account, provider, selectedToken['symbol'].toLowerCase(), chain);
        setAllowed(fau_allowed);
      }
      getInfo();
    }
  }, []);

  useEffect(() => {
    if(account && chain !== selected_chain) {
      setChain(selected_chain);
      selectToken(uniList[selected_chain][0]);
    }
  }, [dispatch, selected_chain]);

  return (
    <>
      <div className="bg-white-bg dark:bg-dark-primary" style={{minHeight:'calc(100vh - 295px)'}}>
        <div className="main-container">
          <div className="py-6 border-b border-grey-dark">
            <h3 className="model-title mb-4">Token Faucet</h3>
            <p className="desc-small">
              Here you can get Tokens to participate in the Testnet, make sure you also got some <a href="https://faucet.dimensions.network/" target="blank"><span className="text-light-primary text-lg">{selected_chain} Token</span></a> in your Wallet.
            </p>
          </div>
          <div className="flex" style={{minHeight:'calc(100vh - 400px)'}}>
            <div className="w-full m-auto">
                <div className="text-center mt-12">
                  <Button variant="outlined" startIcon={<img src={selectedToken['logoURL']} alt="" />} style={{padding:'10px 15px'}} onClick={handleOpen}>
                    {selectedToken['symbol']}
                  </Button>
                </div>
                {!allowed &&
                  <h3 className="font-semibold w-full text-center mb-10 text-lg" style={{color:'#4b4b4b'}}>It's not available to get this token now. Please try 24 hours later after your last request.</h3>
                }
                {allowed &&
                  <div className="text-center">
                    <button
                      onClick={requestTToken}
                      style={{ minHeight: 50, margin:"34px auto" }}
                      className="btn-primary font-bold md:w-1/2 xs:w-full lg:w-1/3 self-center dark:text-black flex-1"
                    >
                      {" "}
                      Request Token{" "}
                    </button>
                  </div>
                }
            </div>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <StyledModal>
              <h3 className="model-title mb-6">Select Token</h3>
              <TextField
                autoFocus={true}
                value={query}
                onChange={filterToken}
                label="Search"
                InputProps={{
                  type: "search",
                  style: {color: '#333'}
                }}
                InputLabelProps={{
                  style: { color: '#333' },
                }}
              />
              <hr className="my-6" />
              <ul className="flex flex-col gap-y-2">
                {filterData.map((item) => {
                  return (
                    <li key={item['address']} className="flex gap-x-1 thelist"  onClick={() => selectToken(item)}>
                      <div className="relative flex">
                        <img src={item['logoURL']} alt="" />
                      </div>
                      <p className="text-light-primary text-lg">{item['symbol']}</p>
                    </li>
                  );
                })}
              </ul>
            </StyledModal>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Faucet;
