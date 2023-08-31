import { useState } from "react";
import * as Form from "@radix-ui/react-form";
import "./style.css";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../util/axios-instance";
import Tags from "./Tags";
import Categories from "./Categories";
import { StyledLoader } from "@phork/phorkit";

import { setIsSubmitted, addProject } from '../../store/slices/projects.slice';
import { useDispatch } from 'react-redux'


const TaskForm = (props) => {
  const [state, setState] = useState({
    name: "",
    description: "",
  });
  const [tags, setTags] = useState();
  const [category, setCategory] = useState();
  const dispatch = useDispatch();


  const Submit = async (dataToPost) => {
    const res = await axiosInstance.post("/projects", dataToPost);
    props.setOpen(false)
    return res.data;
  };

  const {
    isSuccess,
    isLoading,
    error,
    mutate: createProject,
  } = useMutation(Submit, {
    onError: (err) => console.log("The error", err),
    onSuccess: (data) => {
      console.log(data)
      dispatch(addProject(data))
      dispatch(setIsSubmitted(true))
      setState({
        name: "",
        description: "",
      });
    },
  });



  const handleSubmit = (e) => {
    e.preventDefault();
    if (tags !== undefined && category !== undefined) {
      let result = tags?.map(a => a?.id);
      let catArr = [];
      catArr.push(category?.id)
      createProject({ name: state.name, description: state.description, categories: catArr, tags: result });
    }
  };




  function handleChange(event: { target: { name: string; value: string } }) {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }




  return (
    <Form.Root name="categoryForm" onSubmit={handleSubmit} className="FormRoot">
      <Form.Field className="FormField" name="name">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Form.Label className="FormLabel">Name</Form.Label>
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
          <Form.Label className="FormLabel">Description</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please enter a description
          </Form.Message>
        </div>
        <Form.Control asChild>
          <textarea className="Textarea" value={state.description} onChange={handleChange} required />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="category">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Form.Label className="FormLabel">Category </Form.Label>
          <Form.Message className="FormMessage" match={category}>
            Please select a category
          </Form.Message>
        </div>
        <Form.Control asChild>
          <Categories setCategory={setCategory} />

        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="tags">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Form.Label className="FormLabel">Tags</Form.Label>
          <Form.Message className="FormMessage" match={tags}>
            Please select a Tags
          </Form.Message>
        </div>
        <Form.Control asChild>
          <Tags setTags={setTags} />
        </Form.Control>
      </Form.Field>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <Form.Submit asChild>
        {isLoading ?
          <StyledLoader style={{ marginLeft: "30%" }} color="#556270" />
          : <button className="Button" style={{ marginTop: 10 }}>
            Add Project
          </button>
        }

      </Form.Submit>
    </Form.Root>
  );
};

export default TaskForm;
