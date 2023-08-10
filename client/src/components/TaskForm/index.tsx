import React, { useState, useEffect } from 'react';
import * as Form from '@radix-ui/react-form';
import './style.css';
import { colourOptions } from '../../data/dropData'
import AsyncCreatable from 'react-select/async-creatable';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const TaskForm = () => {

  const [state, setState] = useState(
    {
      title: '',
      description: '',
      category: '',
      tags: '',
    }
  );
  const [page] = useState(1);
  const [limit] = useState(100)
  const [tagsClicked, setTagsCLicked] = useState(false);
  const [categoryClicked, setCategoryCLicked] = useState(false);


  const handleTagsApi = useQuery({
    queryKey: ['tags'],
    enabled : tagsClicked,
    queryFn: async () => {
      const response = await axios.get('http://localhost:3333/tags', {
        params: {
          page: page,
          limit: limit
        }
      })
      const data = await response.data;
      console.log(data?.msg)
      return data;
    },
  })

  const handleCategoryApi = useQuery({
    queryKey: ['tags'],
    enabled : categoryClicked,
    queryFn: async () => {
      const response = await axios.get('http://localhost:3333/category', {
        params: {
          page: page,
          limit: limit
        },
      })
      const data = await response.data;
      console.log(data?.msg)
      return data;
    },
  })

  useEffect(() => {
    handleTagsApi
    handleCategoryApi
    // console.log(handleTagsApi,"...category...",handleCategoryApi)

  }, [])


  const Submit = async (dataToPost) => {
    const res = await axios.post('http://localhost:3333/auth/signin', dataToPost)
    return res.data
  }

  const { isLoading, error, mutate: doLogin } =
    useMutation(Submit, {
      onError: (err) => console.log("The error", err),
      onSuccess: (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        setState(
          {
            title: '',
            description: '',
            category: '',
            tags: '',
          }
        )

      }
    })

  const handleSubmit = (e) => {
    e.preventDefault();
    doLogin({ email: state?.email, password: state?.password })
  }

  function handleChange(event: { target: { name: string; value: string; }; }) {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }


  const handleCategoryChange = (category) => {
    console.log(category)
    setCategory(category.value);
  };

  const handleTagsChange = (tags) => {
    console.log(tags)
    // setState((prevState) => ({
    //   ...prevState,
    //   [event.target.name]: event.target.value
    // }))
  };

  const filterColors = (inputValue: string) => {
    return colourOptions.filter(i =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadOptions = (
    inputValue: string,
    callback: (options: ColourOption[]) => void
  ) => {
    setTimeout(() => {
      callback(filterColors(inputValue));
    }, 1000);
  };


  return (
    <Form.Root className="FormRoot">
      <Form.Field className="FormField" name="title">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Form.Label className="FormLabel">Title</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please enter task title
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input className="Input" type="text" required />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="description">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Form.Label className="FormLabel">Description</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please enter a description
          </Form.Message>
        </div>
        <Form.Control asChild>
          <textarea className="Textarea" required />
        </Form.Control>
      </Form.Field>
      <Form.Field className="FormField" name="category">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Form.Label className="FormLabel">Category</Form.Label>
        </div>
        {/* <Form.Control asChild> */}
        <AsyncCreatable
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          onChange={handleTagsChange}
          onFocus={()=>setCategoryCLicked(true)}
          onBlur={()=>setCategoryCLicked(false)}
        />        {/* </Form.Control> */}
      </Form.Field>
      <Form.Field className="FormField" name="tags">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Form.Label className="FormLabel">Tags</Form.Label>
        </div>
        {/* <Form.Control asChild> */}
        <AsyncCreatable
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          isMulti
          onChange={handleTagsChange}
          onFocus={()=>setTagsCLicked(true)}
          onBlur={()=>setTagsCLicked(false)}
        />
        {/* <Select
      closeMenuOnSelect={false}
      defaultValue={[colourOptions[4], colourOptions[5]]}
      isMulti
      options={colourOptions}
      onChange={handleTagsChange}
    /> */}
        {/* </Form.Control> */}
      </Form.Field>
      <Form.Submit asChild>
        <button className="Button" style={{ marginTop: 10 }}>
          Add Task
        </button>
      </Form.Submit>
    </Form.Root>
  )
}

export default TaskForm;