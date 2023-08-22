import React, { useEffect, useState } from 'react';

import CloseIcon from '../../assets/close.png';
import { useModal } from '../../hooks/useModal';
import { useDispatch } from 'react-redux';
import IStatus from '../../interfaces/IStatus';
import { addCard, updateOneCard, } from '../../store/slices/cards.slice';
import {
  Container,
  Input,
  Button,
  ModalContent,
  MultilineInput,
  ErrorMessage
} from './styles';
import { useParams } from 'react-router-dom';
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../util/axios-instance";
import { StyledLoader } from "@phork/phorkit";

interface ModalProps {
  visible: boolean;
}

const Modal: React.FC<ModalProps> = ({ visible }) => {
  const { toggleVisibility, selectedCard } = useModal();
  const { projectId } = useParams();

  const [errorMessage1, setErrorMessage1] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');

  const [state, setState] = useState({
    name: selectedCard ? selectedCard?.name : '',
    description: selectedCard ? selectedCard?.description : '',
    projectId: Number(projectId),
    status: selectedCard ? selectedCard?.status : IStatus.TODO

  })

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedCard) {
      setState((prevState) => ({
        ...prevState,
        name: selectedCard?.name,
        description: selectedCard?.description,
        projectId: Number(projectId),
        status: selectedCard?.status
      }));
    }


  }, [selectedCard, visible])

  const handleSave = () => {
    console.log(state, "statecon");


    if (!state.name) {
      setErrorMessage1("The name field can´t be empty!")
      return;
    }

    if (!state.description) {
      setErrorMessage2("The description field can´t be empty!")
      return;
    }

    setErrorMessage1('');
    setErrorMessage2('');

    if (!errorMessage1 && !errorMessage2) {
      createTask(state);

    }



  }

  const SubmitCard = async (dataToPost) => {
    console.log(dataToPost, "dataToPost")
    const res = await axiosInstance.post("/tasks", dataToPost);
    return res.data;
  };

  const UpdateCard = async (dataToUpdate) => {
    console.log(dataToUpdate, "dataToUpdate")
    const res = await axiosInstance.patch(`/tasks/${selectedCard?.id}`, dataToUpdate);
    return res.data;
  };

  const {
    isLoading,
    error,
    mutate: createTask,
  } = useMutation(selectedCard?.id ? UpdateCard : SubmitCard, {
    onError: (err) => console.log("The error", err),
    onSuccess: (data) => {
      console.log(data, "sucess")
      if (!selectedCard?.id) {

        const newCard = state
        dispatch(addCard(newCard))
        toggleVisibility(undefined);

      }

      const updatedCard = {
        ...selectedCard,
        state
      }

      dispatch(updateOneCard(updatedCard))
      toggleVisibility(undefined);
    },
  });



  function handleChange(event: { target: { name: string; value: string } }) {
    console.log(event.target.name, "onchange")
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }



  const handleCloseModal = () => {
    toggleVisibility(undefined);
    setState((prevState) => ({
      ...prevState,
      name: '',
      description: ''
    }));
    setErrorMessage1('');
    setErrorMessage2('');

  }


  if (!visible) return null;

  return (
    <Container>
      <ModalContent>
        <img src={CloseIcon} alt="Gray X icon" onClick={handleCloseModal} />

        <h3>Title</h3>
        <Input name="name" value={state.name} onChange={handleChange} minLength={1} maxLength={50} />
        {errorMessage1 && (
          <ErrorMessage>{errorMessage1}</ErrorMessage>
        )}

        <h3>Description</h3>
        <MultilineInput
          name="description"
          aria-multiline
          value={state.description}
          onChange={handleChange}
          maxLength={300}

        />
        {errorMessage2 && (
          <ErrorMessage>{errorMessage2}</ErrorMessage>
        )}
        {isLoading ?
          <StyledLoader style={{ marginLeft: "30%" }} color="#556270" />
          : <Button type='button' onClick={handleSave}>{selectedCard ? 'Save Changes' : 'Add Card'}</Button>

        }

        {error && <div style={{ color: 'red' }}>{error}</div>}

      </ModalContent>
    </Container>
  )
}

export default Modal;