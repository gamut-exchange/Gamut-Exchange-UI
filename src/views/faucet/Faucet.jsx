import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Modal from "@mui/material/Modal";
import Button from '@mui/material/Button';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import tw, { styled } from "twin.macro";
import { uniList }  from "../../config/constants";
import { requestToken, allowedToWithdraw } from "../../config/web3";

const Faucet = () => {
  const { account, connector } = useWeb3React();
  const [open, setOpen] = React.useState(false);
  const [selectedToken, setSelectedToken] = useState(uniList[0]);
  const [filterData, setFilterData] = useState(uniList.filter((item, index) => { return index != 0;}));
  const [allowed, setAllowed] = useState(true);

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

  const selectToken = async (item) => {
    handleClose();
    setSelectedToken(item);
    let filterData = uniList.filter(token => {
      return token['address'] != item['address'];
    });
    setFilterData(filterData);
    const provider = await connector.getProvider();
    const fau_allowed = await allowedToWithdraw(account, provider, item['symbol'].toLowerCase());
    setAllowed(fau_allowed);
  }

  const requestTToken = async () => {
    const provider = await connector.getProvider();
    const fau_allowed = await requestToken(account, provider, selectedToken['symbol'].toLowerCase());
    setAllowed(fau_allowed);
  }

  useEffect(() => {
    if(account) {
        const getInfo = async () => {
        const provider = await connector.getProvider();
        const fau_allowed = await allowedToWithdraw(account, provider, selectedToken['symbol'].toLowerCase());
        setAllowed(fau_allowed);
      }
      getInfo();
    }
  }, []);

  return (
    <>
      <div className="bg-white-bg dark:bg-dark-primary py-12" style={{minHeight:'calc(100vh - 280px)'}}>
        <div className="main-container">
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
                style={{ minHeight: 50, margin:"14px auto" }}
                className="btn-primary font-bold md:w-1/2 xs:w-full lg:w-1/3 self-center dark:text-black flex-1"
              >
                {" "}
                Request Token{" "}
              </button>
            </div>
          }
          <hr className="mb-10" />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <StyledModal>
              <h3 className="model-title mb-6">Select Token</h3>
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={filterData.map((option) => option.value)}
                className="input-value"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search"
                    className="input-value"
                    InputProps={{
                      type: "search",
                      className: 'input-value',
                      style: {color: '#333'}
                    }}
                    InputLabelProps={{
                      style: { color: '#333' },
                    }}
                  />
                )}
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
