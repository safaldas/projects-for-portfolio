import { createSlice } from "@reduxjs/toolkit";

import ICard from "../../interfaces/ICard";

interface CardsSliceState {
  cards: ICard[],
  searchText: string
}


const initialState: CardsSliceState = {
  cards: [],
  searchText: ''
}

export const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCards: (state, action) => {
      console.log(action,"set")

      state.cards = action.payload
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload
    },
    addCard: (state, action) => {
      console.log(action,"add")

      const card = action.payload

      state.cards = [...state.cards, card]
    },
    updateOneCard: (state, action) => {
      const cardId = action.payload.id;
      console.log(action,"update")

      const updatedCards = state.cards.map(card => {
        if (card.id === cardId) return action.payload;
        
        else return card;
      })

      state.cards = updatedCards;
    },

  }
})

export const { setCards, updateOneCard, addCard, setSearchText } = cardsSlice.actions;

export default cardsSlice.reducer;