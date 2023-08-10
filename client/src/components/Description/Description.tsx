import React, { useState, useEffect } from 'react';
import { Button, ButtonContainer } from './styles';
import { useNavigate, useLocation  } from "react-router-dom";

import mockCards from '../../data/cards'
import ViewModel from '../../components/ViewModel/ViewModel'


const Description = (props) => {

  const [tasks, setTasks] = useState([]);
  const navigateTo = useNavigate();
  const location = useLocation();

  const{content} = props;

const modalData=()=>{
for (let i = 0; i < mockCards.length; i++) { // changed
  const card = {} 
  card.id = mockCards[i].id;
  card.label = mockCards[i].title;
  tasks.push(card);
}
return tasks
}
useEffect(() => {
    modalData()

  }, [])


  return (
    <>

            <ButtonContainer>
              {location.pathname==='/myProjects' ?  <Button onClick={()=>navigateTo('/board')}>View</Button> : <ViewModel tasks={tasks} content={content}/>}  
                {location.pathname==='/all' && <Button onClick={()=>navigateTo('/board')}>Start</Button>}
            </ButtonContainer>
    </>
  )
}
export default Description;