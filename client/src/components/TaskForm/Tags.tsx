import React, { useState, useEffect } from "react";
import * as Form from "@radix-ui/react-form";
import "./style.css";
import { colourOptions } from "../../data/dropData";
import AsyncCreatable from "react-select/async-creatable";
import { useQuery, useMutation } from "@tanstack/react-query";
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
    const [limit] = useState(100);
    const [tagsClicked, setTagsCLicked] = useState(true);
    const [tagData, setTagData] = useState()
    const [options, setOptions] = useState()



    const handleTagsApi = useQuery({
        queryKey: ["tags"],
        enabled: tagsClicked,
        queryFn: async () => {
            const response = await axiosInstance.get("/tags", {
                params: {
                    page: page,
                    limit: limit,
                },
            });
            const data = await response.data;

            setTagData(data)
            return data;
        },
    });


    useEffect(() => {
        handleTagsApi.dataUpdatedAt
        const data = handleTagsApi?.data?.data
        let tagsData = [];
        for (let i = 0; i < data?.length; i++) { // changed
            const tags = {}
            tags.id = data[i].id;
            tags.label = data[i].name;
            tags.value = data[i].name;
            tagsData.push(tags);

        }
        setOptions(tagsData)
        // console.log(options, "data")

    }, [tagData])

    const createNewTag = async (dataToPost) => {
        const res = await axiosInstance.post("/tags", dataToPost);
        return res.data;
    };

    const {
        isLoading,
        error,
        mutate: createTags,
    } = useMutation(createNewTag, {
        onError: (err) => console.log("The error", err),
        onSuccess: (data) => {
            console.log(data);
            handleTagsApi
        },
    });
    const handleCreateTags = (tag) => {
        createTags({ id: uuidv4(), name: tag });
    };

    const handleTagsChange = (tags) => {
        console.log("changes", tags)

        props.setTags(tags);

    };

    const filterTags = (inputValue: string) => {
        const data = handleTagsApi?.data?.data

        let tagsData = [];
        for (let i = 0; i < data?.length; i++) { // changed
            const tags = {}
            tags.id = data[i].id;
            tags.label = data[i].name;
            tagsData.push(tags);

        }
        console.log(options, "filter")

        return tagsData?.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );

    };

    const promiseOptions = (inputValue: string) =>
        new Promise<TagsOption[]>((resolve) => {
            setTimeout(() => {
                resolve(filterTags(inputValue));
            }, 1000);
        });

    return (
        <AsyncCreatable
            cacheOptions
            defaultOptions={options}
            loadOptions={promiseOptions}
            isMulti
            options={options}
            onChange={handleTagsChange}
            onCreateOption={handleCreateTags}
        />
    )
})
export default Tags;