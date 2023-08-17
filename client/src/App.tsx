import '@phork/phorkit/styles/normalize.css';
import '@phork/phorkit/styles/fonts.css';
import '@phork/phorkit/styles/common.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import KarenBoard from './pages/KanbanBoard/KarenBoard';
import AllProjects from './pages/AllProjects/AllProjects';
import MyProjects from './pages/MyProjects/index';
import SignUp from './pages/SignUp/SignUp';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import ProtectedRoute from './util/ProtectedRoute';



function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={'/'}>
        <div>
          <Routes>
            <Route path="/board"
              element={
                <ProtectedRoute>
                  <KarenBoard />
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

            <Route path="/" element={<Home />}></Route>
            <Route path="/signUp" element={<SignUp />}></Route>



          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
