import React, { useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";

import { useQuery, useMutation } from "@tanstack/react-query";

import { useDispatch, useSelector } from 'react-redux'


import axiosInstance from "../../util/axios-instance";

import { ButtonContainer, Container, ListContainer, TextContainer, Button, NoData } from './style';
import { Card, Typography, Pagination, StyledLoader } from '@phork/phorkit'
import ToolBar from '../../components/ToolBar';
import ViewModel from '../../components/ViewModel/ViewModel'

import { setPage } from '../../store/slices/projects.slice';





const AllProjects = () => {

  const dispatch = useDispatch();

  const navigateTo = useNavigate();
  const project = useSelector((state => state.project));

  const { isAdmin, user } = useSelector((state => state.users));

  const isSubmitted = project?.isSubmitted;
  let page = project?.page;


  const [projectId, setProjectId] = useState();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["projects", page, isSubmitted],
    queryFn: async () => {
      const response = await axiosInstance.get("/projects", {
        params: {
          page: page,
          limit: 10,
        },
      });
      const data = await response.data;
      return data;
    },
  });


  const Assign = async (dataToPost) => {

    if (dataToPost) {
      const res = await axiosInstance.post(`/projects/${dataToPost}/assign`);
      return res.data;
    }
  };

  const {
    isError,
    mutate: updateProject,
  } = useMutation(Assign, {
    onError: (err) => console.log("The error", err),
    onSuccess: (dataVal) => {
      refetch();
      projectId && navigateTo(`/board/${projectId}`)
    },
  });


  const handleStart = (elem) => {

    if (elem.id) {
      const userExist = elem.users.find((userCheck) => userCheck.id === user.id)
      if (userExist) {
        navigateTo(`/board/${elem.id}`)
      } else {
        setProjectId(elem.id)
        updateProject(elem.id);


      }

    }

  };

  const handleEdit = (elem) => {

    navigateTo(`/edit/${elem?.id}`)

  };

  const pageChange = (e: any, pageNo: React.SetStateAction<number>) => {
    dispatch(setPage(pageNo))

  }


  useEffect(() => {

    if (error?.response?.status == '403') {

      console.log(error?.response?.status, "err")
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
                    <ButtonContainer >
                      <ViewModel content={task} />
                      {isAdmin && <Button onClick={() => handleEdit(task)}>Edit</Button>}
                      {!isAdmin && task?.tasks?.length && <Button onClick={() => handleStart(task)}> Start</Button>}

                    </ButtonContainer>

                  </Card>
                )}


              </ListContainer>

              {isError && <div style={{ color: 'red' }}>Please try again later</div>}

              <Pagination
                color="primary"
                justify="center"
                onChangePage={pageChange}
                page={page}
                pageLabelProps={{
                  size: 'large',
                  variants: 'no-wrap'
                }}
                pageLinks={data?.meta?.totalItems}
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
export default AllProjects;
