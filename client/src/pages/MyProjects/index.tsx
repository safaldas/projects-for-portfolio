import { useState, useEffect, SetStateAction } from 'react';
import { Container, ListContainer, TextContainer } from './style';
import { Card, Typography, Pagination } from '@phork/phorkit'
import Description from '../../components/Description/Description'
import ToolBar from '../../components/ToolBar';

const MyProjects = () => {

  const URL = "https://jsonplaceholder.typicode.com/posts";
  const [data, getData] = useState([]);
  const [content, setContent] = useState();

  
  const arrayElm = (task: SetStateAction<undefined>)=>{
    setContent(task);

}

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



  return (
    <>
      <div>
        <Container>
          <ToolBar length={data.length} isAdmin  />
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
        </Container>
      </div>
    </>
  )
}
export default MyProjects;