
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
    <Draggable draggableId={card.id} index={index}>
      {provided => (
        <CardContainer 
          onClick={() => toggleVisibility(card)} 
          hidecard={card.hidden}
          ref={provided.innerRef} 
          {...provided.draggableProps} 
          {...provided.dragHandleProps}
        >
          <h3>{card.title}</h3>
          <CardBottom>
            <p>+ View More</p>
          </CardBottom>
        </CardContainer>
      )}
    </Draggable>
  )
}

export default Card;