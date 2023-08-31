import { configureStore } from '@reduxjs/toolkit'

import cardsReducer from './slices/cards.slice';
import projectReducer from './slices/projects.slice'
import usersReducer from './slices/users.slice'

const store = configureStore({
  reducer: {
    cards: cardsReducer,
    project: projectReducer,
    user: usersReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
