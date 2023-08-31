import { useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";
import "./style.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../util/axios-instance";
import { InteractiveList, List, StyledLoader } from "@phork/phorkit";

import { setIsSubmitted, editProject } from '../../store/slices/projects.slice';
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";
import AddTaskForm from "./AddTaskForm";
import { useModal } from '../../hooks/useModal';
import { ButtonAddCard } from "../../components/ButtonAddCard";



const TaskForm = () => {
    const [state, setState] = useState({
        name: "",
        description: "",
    });
    const dispatch = useDispatch();
    const { projectId } = useParams()
    const navigateTo = useNavigate()

    const { visible, toggleVisibility } = useModal();


    const projectInfo = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/projects/${projectId}`, {
            });
            const data = await response.data;
            setState((prevState) => ({
                ...prevState,
                'name': data.name,
                'description': data.description
            }));
            return data;
        },
    });


    const Submit = async (dataToPost) => {
        const res = await axiosInstance.patch(`/projects/${projectId}`, dataToPost);
        return res.data;
    };


    const {
        isSuccess,
        isLoading,
        error,
        mutate: EditProject,
    } = useMutation(Submit, {
        onError: (err) => console.log("The error", err),
        onSuccess: (data) => {
            dispatch(editProject(data))
            dispatch(setIsSubmitted(true))
            projectInfo.refetch()
        },
    });



    const handleSubmit = (e) => {
        e.preventDefault();
        const categoryArr = projectInfo?.data?.categories?.map(a => a?.id);
        const tagsArr = projectInfo?.data?.tags?.map(a => a?.id);
        const tasksArr = projectInfo?.data?.tasks?.map(a => a?.id);

        EditProject({ name: state.name, description: state.description, tags: tagsArr, categories: categoryArr, tasks: tasksArr });

    };

    function handleChange(event: { target: { name: string; value: string } }) {
        setState((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    }



    const taskList = projectInfo?.data?.tasks?.map(function (row) {

        return { id: row.id, label: row.name }
    })

    const getTaskById = (e, tasks) => {
        const selectedTask = projectInfo?.data?.tasks?.filter(task => tasks.id === task.id)
        toggleVisibility(selectedTask[0]);
    };

    useEffect(() => {

        if (projectInfo?.error?.response?.status == '403') {

            localStorage.clear();
            navigateTo('/')
        }
    }, [error])


    return (
        <div >
            <div className="headBar">
                <h1 className="heading">Edit Project</h1>

                <button className="buttonRight" onClick={() => navigateTo(-1)}>{'<<Back'}</button>

            </div>

            {projectInfo.isLoading ? <StyledLoader style={{ marginLeft: "30%" }} color="#556270" /> :
                <div className="containerEdit">

                    <Form.Root name="categoryForm" onSubmit={handleSubmit} className="FormRootEdit">
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

                        {error && <div style={{ color: 'red' }}>{error}</div>}


                        <Form.Submit asChild>
                            {isLoading ?
                                <StyledLoader style={{ marginLeft: "30%" }} color="#556270" />
                                : <button className="Button" style={{ marginTop: 10 }}>
                                    Edit Changes
                                </button>
                            }

                        </Form.Submit>
                        <div style={{ marginTop: '50px' }}>
                            <h2 className="head">Tasks</h2>
                            <InteractiveList
                                color="primary"
                                initialSelected={[]}
                                items={taskList}
                                size="medium"
                                className="listComp"
                                variant="bordered"
                                onSelect={(e, id) => getTaskById(e, id)}
                                mimicSelectOnFocus
                            />
                            <ButtonAddCard />

                        </div>
                    </Form.Root>
                </div>
            }
            <AddTaskForm visible={visible} />

        </div>
    );
};

export default TaskForm;


