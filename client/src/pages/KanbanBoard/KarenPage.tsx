
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import ICard from '../../interfaces/ICard';
import IStatus from '../../interfaces/IStatus';
import IColumn from '../../interfaces/IColumn';
import Column from '../../components/Column';
import Modal from '../../components/Modal';
import { useModal } from '../../hooks/useModal';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Header, StatusesColumnsContainer } from './styles';
import { setCards } from '../../store/slices/cards.slice';
import { ButtonAddCard } from '../../components/ButtonAddCard';
import GlobalStyle from '../../styles/global';


const KanbanPage = () => {

  const { cards } = useSelector((state => state.cards));
  const { visible } = useModal();

  console.log(cards, "cards")

  const col = ['TODO', 'IN_PROGRESS', 'COMPLETED']


  const interm = {};

  col.forEach((each) => {
    console.log(each, "each")
    interm[`${each}`] = [];
  })


  cards.forEach((each) => {
    if (col.indexOf(each.status) != -1)
      console.log(each.status, "each.status")
    interm[`${each.status}`].push(each)

  })


  const finalArray: { id: number; data: any; status: string; }[] = []
  Object.keys(interm).forEach((each, i) => {
    finalArray.push({ id: i, data: interm[`${each}`], status: each })
  })



  const dispatch = useDispatch();

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    console.log(destination, source, draggableId)

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const updatedCards: ICard[] = cards.map(card => {
      if (card.id === draggableId) {

        const status: IStatus = destination.droppableId as IStatus;

        return {
          ...card,
          status
        }
      } else return card;
    })

    const sourceColumn: IColumn = finalArray.find(column => column.status === source.droppableId);
    const destinationColumn: IColumn = finalArray.find(column => column.status === destination.droppableId);

    //Moving cards in the same column
    if (sourceColumn === destinationColumn) {

      dispatch(setCards(updatedCards))

      return
    }

    dispatch(setCards(updatedCards))

  }


  return (
    <>
      <GlobalStyle />

      <Container>
        <Header>
          <h1>Project Title</h1>

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
        <ButtonAddCard />
      </Container>
      <Modal visible={visible} />
    </>
  )
}

export default KanbanPage;