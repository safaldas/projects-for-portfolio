import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import CloseIcon from '../../assets/close.png';
import { useModal } from '../../hooks/useModal';
import { useAppDispatch } from '../../hooks/useRedux';
import IStatus from '../../interfaces/IStatus';
import { addCard, updateOneCard , } from '../../store/slices/cards.slice';
import { updateColumns } from '../../store/slices/columns.slice';
import { 
  Container, 
  Input, 
  Button,
  ModalContent, 
  MultilineInput, 
  ErrorMessage
} from './styles';

interface ModalProps{
  visible: boolean;
}

const Modal: React.FC<ModalProps> = ({visible}) => {
  const { toggleVisibility, selectedCard } = useModal();
  const theme = useContext(ThemeContext); 

  const [title, setTitle] = useState<string | undefined>(selectedCard?.title);
  const [description, setDescription] = useState<string | undefined>(selectedCard?.description);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    setTitle(selectedCard?.title);
    setDescription(selectedCard?.description);
  }, [selectedCard, visible])

  const handleSave = () => {

    if (!title){
      setErrorMessage("The title field can´t be empty!")
      return;
    }

    setErrorMessage(undefined);

    if(!selectedCard?.id){
      const newCard = {
        id: uuidv4(),
        title,
        description,
        status: IStatus.TO_DO,
        hidden: false,
      }
      dispatch(addCard(newCard))
      dispatch(updateColumns(newCard.id))
      toggleVisibility(undefined);

    }

    const updatedCard = {
      ...selectedCard,
      title,
      description,
    }

    dispatch(updateOneCard(updatedCard))
    toggleVisibility(undefined);
  }

  const handleCloseModal = () => {
    toggleVisibility(undefined);
    setTitle(undefined);
    setDescription(undefined);
    setErrorMessage(undefined);
  }
  

  if (!visible) return null;

  return (
    <Container>
      <ModalContent>
        <img src={CloseIcon} alt="Gray X icon" onClick={handleCloseModal}/>

        <h3>Title</h3>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} minLength={1} maxLength={50} containsError={!!errorMessage}/>
        {errorMessage && (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        )}

        <h3>Description</h3>
        <MultilineInput 
          aria-multiline 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          maxLength={300}
        />
        <Button type='button' onClick={handleSave}>{selectedCard ? 'Save Changes' : 'Add Card'}</Button>

      </ModalContent>
    </Container>
  )
}

export default Modal;