import { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";
import "./style.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../util/axios-instance";
import { StyledLoader } from "@phork/phorkit";

import CloseIcon from '../../assets/close.png';


import { useModal } from '../../hooks/useModal';
import { useDispatch } from 'react-redux';
import IStatus from '../../interfaces/IStatus';
import { addCard, updateOneCard, } from '../../store/slices/cards.slice';
import { useParams } from 'react-router-dom';

const AddTaskForm = ({ visible }) => {

  const { toggleVisibility, selectedCard } = useModal();

  const { projectId } = useParams();

  const [state, setState] = useState({
    name: selectedCard !== undefined ? selectedCard?.name : '',
    description: selectedCard !== undefined ? selectedCard?.description : '',
    projectId: Number(projectId),
    status: IStatus.TODO

  })
  const dispatch = useDispatch();


  useEffect(() => {
    if (selectedCard !== undefined) {
      setState((prevState) => ({
        ...prevState,
        name: selectedCard?.name,
        description: selectedCard?.description,
        projectId: Number(projectId),
        status: selectedCard?.status
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        name: '',
        description: '',
        projectId: Number(projectId),
        status: IStatus.TODO
      }));
    }


  }, [selectedCard, visible])

  const handleSave = () => {
    // console.log(state, "statecon");

    createTask(state);

  }

  const SubmitCard = async (dataToPost) => {
    // console.log(dataToPost, "dataToPost")
    const res = await axiosInstance.post("/tasks", dataToPost);
    return res.data;
  };

  const UpdateCard = async (dataToUpdate) => {
    // console.log(dataToUpdate, "dataToUpdate")
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
      // console.log(data, "sucess")
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
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  const handleCloseModal = () => {
    toggleVisibility(undefined);

  }

  if (!visible) return null;



  return (
    <div className="containerModal">
      <div className="modalContent">
        <h2>Add Task</h2>
        <img src={CloseIcon} alt="Gray X icon" className="imgClose" onClick={handleCloseModal} />

        <Form.Root name="categoryForm" onSubmit={handleSave} className="FormRoot">
          <Form.Field className="FormField" name="name">
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <Form.Label className="FormLabelEdit">Name</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                Please enter task name
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input className="Input" value={state.name} onChange={handleChange} type="text" required />
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="description">
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <Form.Label className="FormLabelEdit">Description</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                Please enter a description
              </Form.Message>
            </div>
            <Form.Control asChild>
              <textarea className="Textarea" value={state.description} onChange={handleChange} required />
            </Form.Control>
          </Form.Field>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <Form.Submit asChild>
            {isLoading ?
              <StyledLoader style={{ marginLeft: "30%" }} color="#556270" />
              : <button className="Button" style={{ marginTop: 10 }}>
                {selectedCard?.id ? 'Update Task' : 'Add Task'}
              </button>
            }

          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
};

export default AddTaskForm;
