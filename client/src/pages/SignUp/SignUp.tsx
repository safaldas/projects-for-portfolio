import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import './style.css';
import { useNavigate  } from "react-router-dom";
// import { useQuery } from '@tanstack/react-query'; get data
import { useMutation } from '@tanstack/react-query'
import axios from 'axios';
import {StyledLoader } from '@phork/phorkit'

const FormDemo = () => {
  
const [state, setState] = useState(
  {
    email:'',
    password:'',
    name:''
  }
)
const [errorMsg, setErrorMsg] = useState('')

  const navigateTo = useNavigate();

  const newPostMutation = useMutation({
    mutationFn: async () => {
      let data;
      try {
        const response = await axios.post('http://localhost:3333/auth/signup', {
          "email": state.email,
          "password" : state.password,
          "name" : state.name
        });
        data = response.data;
        setState(
          {
            email:'',
            password:'',
            name:''
          }
        ) 
  
      navigateTo('/')

      } catch (error) {
        console.error('Error fetching todos:', error);
        data = error;
        setErrorMsg(error)
      }
      

    
      return data;
    }
 })
//  if( newPostMutation.isError ) return (<h1>Error loading data!!!</h1>)

 const handleSubmit = async (event: { preventDefault: () => void; }) => { 
  event.preventDefault();
  // console.log(event, state)

  newPostMutation.mutate();

}
console.log(errorMsg.status,"err")
function handleChange(event: { target: { name: string; value: string; }; }) {
  // console.log("change",event)
  setState( (prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
  }) )
}

  return(
  <div>  <h1 className='head'>SIGN UP</h1>
  
  <div className="signUpRoot">
  <Form.Root className="FormRoot" onSubmit={handleSubmit}>
  <Form.Field className="FormField" name="name">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Form.Label className="FormLabel">Name</Form.Label>
        <Form.Message className="FormMessage" match="valueMissing">
          Please enter your name
        </Form.Message>
      </div>
      <Form.Control asChild>
        <input className="Input" type="name" value={state.name} onChange={handleChange} required />
      </Form.Control>
    </Form.Field>
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
        <input className="Input" type="email" value={state.email} onChange={handleChange} required />
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
        <input type='password' className="Input" value={state.password} onChange={handleChange} required />
      </Form.Control>
    </Form.Field>
    <Form.Submit asChild>
    {!newPostMutation.isLoading || newPostMutation.error?
    <button className="Button" type='submit' style={{ marginTop: 10 }}>
       Submit
      </button>
      :
       <StyledLoader style={{marginLeft:'30%'}} color="#556270" />}
    </Form.Submit>
    <div style={{color:'red',fontWeight:'bold',marginLeft:'30%'}}>{errorMsg?.response?.status?(errorMsg?.response?.status === 403 ? 'User ALready Exist' :'Something went wrong please try again later.'):''}</div>
    <button className='signUp' onClick={()=>navigateTo('/')}>{`Login>>`}</button>
  </Form.Root>
  </div>
  </div>
  
  )
}

export default FormDemo;
