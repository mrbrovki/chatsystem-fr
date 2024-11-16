import { useContext } from "react";
import styled from "styled-components";
import { ActionType, ModalMode } from "../context/types";
import { Context } from "../context";

const Wrapper = styled.div`
  background-color: #00000043;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledModal = styled.div`
  width: 80%;
  max-width: 30rem;
  height: 10rem;
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-flow: column nowrap;
  text-align: center;
  box-shadow: 0 0 8px #00000042;
`;
const ButtonsWrapper = styled.div`
  margin-top: auto;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 1rem;
`;

const Modal = () => {
  const {
    state: { modal },
    dispatch,
  } = useContext(Context);

  const cancel = () => {
    dispatch({
      type: ActionType.MODAL_MODE,
      payload: { mode: ModalMode.NONE, content: "" },
    });
  };

  switch (modal.mode) {
    case ModalMode.NOTIFICATION:
      return (
        <Wrapper onClick={cancel}>
          <StyledModal onClick={(e) => e.stopPropagation()}>
            this is modal
          </StyledModal>
        </Wrapper>
      );
    case ModalMode.CONFIRM:
    case ModalMode.DELETE:
      return (
        <Wrapper onClick={cancel}>
          <StyledModal onClick={(e) => e.stopPropagation()}>
            <div>{modal.content}</div>
            <ButtonsWrapper>{modal.buttons}</ButtonsWrapper>
          </StyledModal>
        </Wrapper>
      );
    case ModalMode.NONE: {
      return <></>;
    }
  }
};

export default Modal;
