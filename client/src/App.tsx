import '@phork/phorkit/styles/normalize.css';
import '@phork/phorkit/styles/fonts.css';
import '@phork/phorkit/styles/common.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import ProtectedRoute from './util/ProtectedRoute';
import { Provider } from 'react-redux';
import store from './store';
import { ModalProvider } from './hooks/useModal';

import Home from './pages/Home/Home';
import KarenBoard from './pages/KanbanBoard/KarenPage';
import AllProjects from './pages/AllProjects/AllProjects';
import MyProjects from './pages/MyProjects/index';
import SignUp from './pages/SignUp/SignUp';
import EditProject from './pages/EditProject/EditProject';
import axios from 'axios';





function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>

        <BrowserRouter basename={'/'}>
          <div>
            <Routes>
              <Route path="/board/:projectId"
                element={
                  <ProtectedRoute>
                    <ModalProvider>
                      <KarenBoard />
                    </ModalProvider>
                  </ProtectedRoute>
                }>
              </Route>
              <Route path="/all" element={
                <ProtectedRoute>
                  <AllProjects />
                </ProtectedRoute>
              }></Route>
              <Route path="/myProjects" element={
                <ProtectedRoute>
                  <MyProjects />
                </ProtectedRoute>
              }></Route>
              <Route path="/edit/:projectId" element={
                <ProtectedRoute>
                  <ModalProvider>
                    <EditProject />
                  </ModalProvider>
                </ProtectedRoute>
              }></Route>

              <Route path="/" element={<Home />}></Route>
              <Route path="/signUp" element={<SignUp />}></Route>



            </Routes>
          </div>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
