import React, { useState, useEffect } from "react";
import "./style.css";
import AsyncCreatable from "react-select/async-creatable";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../../util/axios-instance";
import { v4 as uuidv4 } from 'uuid';

export interface CategoriesOption {
    readonly id: string;
    readonly label: string;
}

interface AwesomeInputProps {
    props?: boolean;
    ref?: React.Ref<Text>;
}

const Categories: React.FC<AwesomeInputProps> = React.forwardRef((props, ref) => {
    const [page] = useState(1);
    const [limit] = useState(100);
    const [categoryData, setCategoryData] = useState()
    const [options, setOptions] = useState()
    const [search, setSearch] = useState("");

    function handleCategoryChange(category) {
        console.log("hitt", category)
        // Here, we invoke the callback with the new value
        props.setCategory(category)
    }

    const handleCategoriesApi = useQuery({
        queryKey: ["categories", { input: "" }],
        queryFn: async () => {
            const response = await axiosInstance.get("/category", {
                params: {
                    page: page,
                    limit: limit,
                    q: search
                },
            });
            const data = await response.data;

            setCategoryData(data)
            return data;
        },
    });



    useEffect(() => {
        console.log(search)
        handleCategoriesApi.dataUpdatedAt
        const data = handleCategoriesApi?.data?.data
        const categoriesData = [];
        for (let i = 0; i < data?.length; i++) { // changed
            const categories = {}
            categories.id = data[i].id;
            categories.label = data[i].name;
            categoriesData.push(categories);

        }
        setOptions(categoriesData)

    }, [categoryData])


    const createNewCategory = async (dataToPost: any) => {
        const res = await axiosInstance.post("/category", dataToPost);
        return res.data;
    };

    const {
        mutate: createCategories,
    } = useMutation(createNewCategory, {
        onError: (err) => console.log("The error", err),
        onSuccess: (data) => {
            console.log(data);
            handleCategoriesApi
        },
    });
    const handleCreateCategories = (category: any) => {
        createCategories({ id: uuidv4(), name: category });
    };




    const filterCategories = (inputValue: string) => {



        const data = handleCategoriesApi?.data?.data

        const categoriesData = [];
        for (let i = 0; i < data?.length; i++) { // changed
            const categories = {}
            categories.id = data[i].id;
            categories.label = data[i].name;
            categoriesData.push(categories);

        }

        return categoriesData?.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );

    };
    const loadOptions = (
        inputValue: string,
        callback: (options: CategoriesOption[]) => void
    ) => {
        setTimeout(() => {
            callback(filterCategories(inputValue));
        }, 1000);
    };


    return (
        <>
            <AsyncCreatable
                cacheOptions
                defaultOptions={options}
                loadOptions={loadOptions}
                onChange={handleCategoryChange}
                onCreateOption={handleCreateCategories}
            />
        </>
    )
})
export default Categories;