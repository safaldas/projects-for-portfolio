import React, { useState, useEffect } from 'react';
import { Container, ListContainer, TextContainer, Button, ButtonContainer, NoData } from './style';
import { Card, Typography, Pagination, StyledLoader } from '@phork/phorkit'
import { useNavigate } from "react-router-dom";
import ToolBar from '../../components/ToolBar';

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../util/axios-instance";

// import { useDispatch,useSelector } from 'react-redux';

const MyProjects = () => {

  const navigateTo = useNavigate();

  const [page, setPage] = useState(1)
  const user = JSON.parse(localStorage.getItem('user'))

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects", page],
    queryFn: async () => {
      const response = await axiosInstance.get("/projects", {
        params: {
          page: page,
          limit: 10,
          user: user.id

        },
      });
      const data = await response.data;

      return data;
    },
  });


  const pageChange = (e: any, pageNo: React.SetStateAction<number>) => {
    setPage(pageNo)
  }

  useEffect(() => {

    if (error?.response?.status == '403') {

      localStorage.clear();
      navigateTo('/')
    }
  }, [error])


  return (
    <>
      <div>
        {isLoading ? <StyledLoader style={{ marginLeft: "30%" }} color="#556270" /> :

          <Container>
            <ToolBar length={data?.data?.length} isAdmin />
            {data?.data?.length ? <div>
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
                    <ButtonContainer>
                      <Button onClick={() => navigateTo(`/board/${task?.id}`)}>View</Button>
                    </ButtonContainer>
                  </Card>
                )}


              </ListContainer>
              <Pagination
                color="primary"
                justify="center"
                onChangePage={pageChange}
                page={1}
                pageLabelProps={{
                  size: 'large',
                  variants: 'no-wrap'
                }}
                pageLinks={6}
                pageSize={10}
                shape="pill"
                size="large"
                spacing="joined"
                totalItems={data?.meta?.totalItems}
                weight="shaded"
                withIcons
                withPageLinks
                withPreviousAndNext
              />
            </div> : <NoData>No Data Found</NoData>}
          </Container>
        }
      </div>
    </>
  )
}
export default MyProjects;