import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import './style.css';
import { useNavigate } from "react-router-dom";
import { useMutation } from '@tanstack/react-query'
import axios from 'axios';
import { StyledLoader } from '@phork/phorkit'


const FormDemo = () => {


  const [state, setState] = useState(
    {
      email: '',
      password: '',
    }
  )


  const navigateTo = useNavigate();

  const Login = async (dataToPost) => {
    const res = await axios.post('http://localhost:3333/auth/signin', dataToPost)
    return res.data
  }

  const {  isLoading, error, mutate: doLogin } =
    useMutation(Login, {
      onError: (err) => console.log("The error", err),
      onSuccess: (data) => {
        localStorage.setItem("user",  JSON.stringify(data));
        setState(
          {
            email: '',
            password: '',
          }
        )
        navigateTo('/all')

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


  return (
    <div>  <h1 className='head'>Task Manager</h1>

      <div className="homeRoot">
        <Form.Root className="FormRoot" onSubmit={handleSubmit}>
          <Form.Field className="FormField" name="email">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <Form.Label className="FormLabel">Email</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                Please enter your email
              </Form.Message>
              <Form.Message className="FormMessage" match="typeMismatch">
                Please provide a valid email
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input className="Input" onChange={handleChange} value={state.email} type="email" required />
            </Form.Control>
          </Form.Field>
          <Form.Field className="FormField" name="password">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <Form.Label className="FormLabel">Password</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                Please enter a password
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input type='password' className="Input" onChange={handleChange} value={state.password} required />
            </Form.Control>
          </Form.Field>
          <Form.Submit asChild>
            {!isLoading ?
              <button className="Button" type='submit' style={{ marginTop: 10 }}>
                Login
              </button>
              :
              <StyledLoader style={{ marginLeft: '30%' }} color="#556270" />}
          </Form.Submit>
          <div style={{ color: 'red', fontWeight: 'bold', marginLeft: '10%' }}>{error?.response?.data?.message}</div>
          <button className='signUp' onClick={() => navigateTo('/signUp')}>{`Signup>>`}</button>
        </Form.Root>
      </div>
    </div>

  )
}

export default FormDemo;
