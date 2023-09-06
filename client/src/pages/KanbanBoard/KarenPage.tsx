
import { DragDropContext } from 'react-beautiful-dnd';
import { useNavigate, useParams } from 'react-router-dom';


import { useQuery } from '@tanstack/react-query';
import { StyledLoader } from '@phork/phorkit';
import { useDispatch, useSelector } from 'react-redux';


import axiosInstance from "../../util/axios-instance";
import Column from '../../components/Column';
import Modal from '../../components/Modal';
import { useModal } from '../../hooks/useModal';
import { Container, Header, StatusesColumnsContainer } from './styles';
import { setCards } from '../../store/slices/cards.slice';
import GlobalStyle from '../../styles/global';
import { useEffect } from 'react';


const KanbanPage = () => {

  const { cards } = useSelector((state => state.cards));
  const { visible } = useModal();
  const { projectId } = useParams()
  const navigateTo = useNavigate()

  const col = ['TODO', 'IN_PROGRESS', 'COMPLETED']



  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/projects/${projectId}/mytasks`);

      const data = await response.data;
      dispatch(setCards(data))

      return data;

    },
  });

  useEffect(() => {

    if (error?.response?.status == '403') {

      localStorage.clear();
      navigateTo('/')
    }
  }, [error])


  const sortedCards = {};

  col.forEach((each) => {
    sortedCards[`${each}`] = [];
  })

  cards?.forEach((each) => {
    if (col.indexOf(each.status) != -1)
      sortedCards[`${each.status}`].push(each)

  })


  const finalArray: { id: number; data: any; status: string; }[] = []
  Object.keys(sortedCards).forEach((each, i) => {
    finalArray.push({ id: i, data: sortedCards[`${each}`], status: each })
  })



  const dispatch = useDispatch();


  const onDragEnd = (result) => {

    const { destination, source, draggableId } = result;


    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    cards.map(async card => {
      if (card.id == draggableId) {
        try {
          const response = await axiosInstance.patch(`/projects/${projectId}/mytasks/${card.taskId}/status`, {

            userTaskId: card.id,
            status: destination.droppableId
          })
          const dataVal = await response.data;
          refetch();
          return dataVal;
        }
        catch (err) {
          console.log(err)
        }

      }
    })


  }


  return (
    <>
      <GlobalStyle />
      {isLoading ? <StyledLoader style={{ marginLeft: "30%" }} color="#556270" /> :
        <>
          {data ?
            <Container>
              <Header>
                <h1>BOARD</h1>
                <button style={{ backgroundColor: '#808088' }} onClick={() => navigateTo(-1)}>{'<<Back'}</button>

              </Header>

              <StatusesColumnsContainer>
                <DragDropContext onDragEnd={onDragEnd}>
                  {finalArray.map((column, index) => {


                    return (
                      <Column
                        key={column.id}
                        index={index}
                        status={column.status}
                        cards={column.data}
                      />
                    )
                  })}
                </DragDropContext>
              </StatusesColumnsContainer>
              {/* <ButtonAddCard /> */}
            </Container>
            : <div>No data Found</div>}

          <Modal visible={visible} />
        </>}
    </>
  )
}

export default KanbanPage;

