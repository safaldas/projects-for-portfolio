import React, { useState, useEffect } from 'react';
import { Container, ListContainer, TextContainer } from './style';
import { Card, Typography, Pagination, StyledLoader } from '@phork/phorkit'
import Description from '../../components/Description/Description'
import ToolBar from '../../components/ToolBar';

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../util/axios-instance";

const AllProjects = () => {

  const [dataContent, getData] = useState([]);
  // const [isAdmin, setisAdmin] = useState(true);
  const [content, setContent] = useState();


  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await axiosInstance.get("/projects", {
        params: {
          page: 1,
          limit: 10,
        },
      });
      const data = await response.data;

      getData(data)
      return data;
    },
  });


  const arrayElm = (task: React.SetStateAction<undefined>) => {
    setContent(task);

  }


  return (
    <>
      <div>
        {isLoading ? <StyledLoader style={{ marginLeft: "30%" }} color="#556270" /> :

          <Container>
            <ToolBar length={data?.data?.length} isAdmin />
            <ListContainer>

              {data?.data?.map((task) =>
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
                      {task?.name}
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
                      {`${task?.description?.substring(0, 100)}...`}
                    </Typography>
                  </TextContainer>
                  <div onClick={() => arrayElm(task)}>
                    <Description content={content} />

                  </div>
                </Card>
              )}


            </ListContainer>
            <Pagination
              color="primary"
              justify="center"
              onChangePage={function noRefCheck() { }}
              page={8}
              pageLabelProps={{
                size: 'large',
                variants: 'no-wrap'
              }}
              pageLinks={6}
              pageSize={10}
              shape="pill"
              size="large"
              spacing="joined"
              totalItems={300}
              weight="shaded"
              withIcons
              withPageLinks
              withPreviousAndNext
            />
          </Container>
        }
      </div>
    </>
  )
}
export default AllProjects;