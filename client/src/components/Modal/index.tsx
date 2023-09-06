import React from 'react';

import CloseIcon from '../../assets/close.png';
import { useModal } from '../../hooks/useModal';
import {
  Container,
  ModalContent,
} from './styles';

interface ModalProps {
  visible: boolean;
}

const Modal: React.FC<ModalProps> = ({ visible }) => {
  const { toggleVisibility, selectedCard } = useModal();


  const handleCloseModal = () => {
    toggleVisibility(undefined);

  }


  if (!visible) return null;

  return (
    <Container>
      <ModalContent>
        <img src={CloseIcon} alt="Gray X icon" onClick={handleCloseModal} />

        <h3 style={{ textAlign: 'center', marginBottom: '5rem' }}>{selectedCard?.name}</h3>
        <p>{selectedCard?.description}</p>



      </ModalContent>
    </Container>
  )
}

export default Modal;