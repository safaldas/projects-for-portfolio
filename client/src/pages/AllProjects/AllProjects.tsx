import React, { useState, useEffect } from 'react';
import { Container, ListContainer,Button, ButtonContainer,TextContainer } from './style';
import { Card, Typography, Pagination } from '@phork/phorkit'
import Description from '../../components/Description/Description'
import { useNavigate } from "react-router-dom";
import ToolBar from '../../components/ToolBar';

import mockCards from '../../data/cards'
import ViewModel from '../../components/ViewModel/ViewModel'

const AllProjects = () => {

  const URL = "https://jsonplaceholder.typicode.com/posts";
  const [data, getData] = useState([]);
  // const [isAdmin, setisAdmin] = useState(true);
  const [content, setContent] = useState();


  const navigateTo = useNavigate();



  useEffect(() => {
    fetchData();
    //  console.log(data[0])
  }, []);

  const fetchData = () => {
    fetch(URL)
      .then((res) => res.json())

      .then((response) => {
        // console.log(response);
        getData(response);
      });
  };

  const arrayElm = (task: React.SetStateAction<undefined>)=>{
      setContent(task);

  }


  return (
    <>
      <div>
        <Container>
          <ToolBar length={data.length} isAdmin />
          {/* <Header>
            <h1>All Projects {`(${data.length})`}</h1>

            <Button
  as="button"
  onClick={()=>navigateTo('/myProject')}
  type="button"
  weight="inline"
  size='large'
  style={{fontSize:'20px'}}
>
 My Projects
</Button>       
     {isAdmin && <AddProject/>}
     <Button
  as="button"
  onClick={()=>navigateTo('/')}
  type="button"
  weight="solid"
  size='large'
>
 logout
</Button>    */}
          {/* </Header> */}
          <ListContainer>

            {data.map((task) =>
              <Card
                hoverable
                raised={10}
                key={task?.id}
                id={task?.id}
                style={{
                  marginLeft: "50px",
                  marginBottom: "50px",
                  width: "25%"
                }}
                onClick={() => setContent(task)}
              >
                <TextContainer>
                <Typography
                  as="h1"
                  color="primary"
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {task?.title}
                </Typography>
                <Typography
                  as="div"
                  color="primary"
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {`${task?.body?.substring(0, 100)}...`}
                </Typography>
                </TextContainer>
                <div onClick={()=>arrayElm(task)}>
                <Description content={content}/>

                </div>
                {/* <ButtonContainer>
              {location.pathname==='/myProjects' ?  <Button onClick={()=>navigateTo('/board')}>View</Button> : <ViewModel tasks={task} body={task?.body}/>}  
                {location.pathname==='/all' && <Button onClick={()=>navigateTo('/board')}>Start</Button>}
            </ButtonContainer> */}
              </Card>
            )}

            <Pagination
              color="primary"
              justify="start"
              onChangePage={function noRefCheck() { }}
              page={8}
              pageLabelProps={{
                size: 'medium',
                variants: 'no-wrap'
              }}
              pageLinks={6}
              pageSize={10}
              shape="pill"
              size="medium"
              spacing="joined"
              totalItems={300}
              weight="shaded"
              withIcons
              withPageLinks
              withPreviousAndNext
            />
          </ListContainer>
          {/* {content && <Description content={content} />} */}
        </Container>
      </div>
    </>
  )
}
export default AllProjects;