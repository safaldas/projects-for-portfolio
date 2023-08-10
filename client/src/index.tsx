import { Provider } from 'react-redux';
import KanbanBoard from '../../pages/KanbanBoard';
import { ModalProvider } from './hooks/useModal';
import store from './store';
import GlobalStyle from './styles/global';

function KarenBoard() {


  return (
    <Provider store={store}>
        <ModalProvider>
          <div className="App">
            <GlobalStyle/>
            <KanbanBoard />
          </div>
        </ModalProvider>
    </Provider>
  );
}

export default KarenBoard;
