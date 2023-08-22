import { configureStore } from '@reduxjs/toolkit'

import cardsReducer from './slices/cards.slice';
import projectReducer from './slices/projects.slice'

const store = configureStore({
  reducer: {
    cards: cardsReducer,
    project: projectReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
