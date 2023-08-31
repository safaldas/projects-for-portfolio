
import { Draggable } from 'react-beautiful-dnd';

import { useModal } from '../../hooks/useModal';
import ICard from '../../interfaces/ICard';

import { CardBottom, CardContainer } from './styles';

interface CardProps {
  card: ICard;
  index: number;
}

const Card: React.FC<CardProps> = ({ card, index }) => {


  const { toggleVisibility } = useModal();

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {provided => (
        <CardContainer
          // onClick={() => toggleVisibility(card)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h3>{card.task.name}</h3>
          <CardBottom>
            <button onClick={() => toggleVisibility(card.task)}>view more +</button>
          </CardBottom>
        </CardContainer>
      )}
    </Draggable>
  )
}

export default Card;