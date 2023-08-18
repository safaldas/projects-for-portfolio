import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import "./style.css";
import { colourOptions } from "../../data/dropData";
import AsyncCreatable from "react-select/async-creatable";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../util/axios-instance";
import { v4 as uuidv4 } from 'uuid';

export interface TagsOption {
    readonly id: string;
    readonly label: string;
    readonly value: string;

}

interface AwesomeInputProps {
    props?: boolean;
    ref?: React.Ref<Text>;
}

const Tags: React.FC<AwesomeInputProps> = React.forwardRef((props, ref) => {

    const [page] = useState(1);
    const [limit] = useState(5);



    const createNewTag = async (dataToPost) => {
        const res = await axiosInstance.post("/tags", dataToPost);
        return res.data;
    };

    const {
        mutate: createTags,
    } = useMutation(createNewTag, {
        onError: (err) => console.log("The error", err),
        onSuccess: (data) => {
            console.log(data);
            filterTags("")
        },
    });
    const handleCreateTags = (tag) => {
        createTags({ id: uuidv4(), name: tag });
    };

    const handleTagsChange = (tags) => {

        props.setTags(tags);

    };

    const filterTags = async (inputValue: string) => {
        try {
            const response = await axiosInstance.get("/tags", {
                params: {
                    page: page,
                    limit: limit,
                    q: inputValue
                },
            })
            const resData = await response.data;
            const dataVal = resData?.data
            const data = dataVal?.map(function (row) {

                return { id: row.id, label: row.name, value: row.id }
            })
            return data;
        }
        catch (err) {
            console.log(err)
        }
    };

    const promiseOptions = (inputValue: string) =>
        new Promise<TagsOption[]>((resolve) => {
            resolve(filterTags(inputValue));
        });


    return (
        <AsyncCreatable
            defaultOptions
            loadOptions={promiseOptions}
            isMulti
            onChange={handleTagsChange}
            onCreateOption={handleCreateTags}
        />
    )
})
export default Tags;