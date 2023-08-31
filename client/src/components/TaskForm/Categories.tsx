import React, { useState, useEffect } from "react";
import "./style.css";
import AsyncCreatable from "react-select/async-creatable";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../util/axios-instance";
import { v4 as uuidv4 } from 'uuid';

export interface CategoriesOption {
    readonly id: string;
    readonly label: string;
}

interface AwesomeInputProps {
    setCategory(category: any): unknown;
    props?: boolean;
    ref?: React.Ref<Text>;
}

const Categories: React.FC<AwesomeInputProps> = React.forwardRef((props, ref) => {
    const [page] = useState(1);
    const [limit] = useState(5);
    const [options, setOptions] = useState([])

    function handleCategoryChange(category: any) {
        props.setCategory(category)
    }


    const createNewCategory = async (dataToPost: any) => {
        const res = await axiosInstance.post("/category", dataToPost);
        return res.data;
    };

    const {
        mutate: createCategories,
    } = useMutation(createNewCategory, {
        onError: (err) => console.log("The error", err),
        onSuccess: (dataVal) => {
            setOptions({ ...options, dataVal })
            filterCategory();
        }

    });
    const handleCreateCategories = (category: any) => {
        createCategories({ id: uuidv4(), name: category });
    };


    const filterCategory = async (inputValue = "") => {
        try {
            const response = await axiosInstance.get("/category", {
                params: {
                    page: page,
                    limit: limit,
                    q: inputValue
                },
            })
            const resData = await response.data;
            const dataRecived = resData?.data
            const data = dataRecived?.map(function (row) {

                return { id: row.id, label: row.name, value: row.id }
            })
            setOptions(data)

            return data;

        }
        catch (err) {
            console.log(err)
        }
    };

    const promiseOptions = (inputValue: string) =>
        new Promise<CategoriesOption[]>((resolve) => {
            resolve(filterCategory(inputValue));
        });





    return (
        <>
            <AsyncCreatable
                defaultOptions
                loadOptions={promiseOptions}
                onChange={handleCategoryChange}
                onCreateOption={handleCreateCategories}
                options={options}

            />
        </>
    )
})
export default Categories;