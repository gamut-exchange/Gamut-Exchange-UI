import React from "react";
import { Modal } from "@mui/material";
import tw from "twin.macro";
import Efficient from "./Efficient";

const EfficientModel = ({ open, close }) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ padding: 1 }}
      >
        <StyledModal>
          <Efficient />
        </StyledModal>
      </Modal>
    </div>
  );
};

export default EfficientModel;

const StyledModal = tw.div`
flex
flex-col
absolute
top-1/2 left-1/2
bg-white
max-w-[1057px] w-full
px-6
shadow-box 
min-h-min
transform -translate-x-1/2 -translate-y-1/2
`;
