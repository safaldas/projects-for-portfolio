import React, { useEffect, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import './styles.css';
import { List } from '@phork/phorkit'
import mockCards from '../../data/cards'


const AlertDialogDemo = (props) => {
  const { content } = props;
  const [tasks, setTasks] = useState([]);

  const modalData = () => {
    for (let i = 0; i < mockCards.length; i++) { // changed
      const card = {}
      card.id = mockCards[i].id;
      card.label = mockCards[i].name;
      tasks.push(card);
    }
    return tasks
  }
  useEffect(() => {
    modalData()

  }, [])
  return (

    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="Button violet">View</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AlertDialogContent">
          <AlertDialog.Title className="AlertDialogTitle"> Title</AlertDialog.Title>
          <AlertDialog.Description className="AlertDialogDescription">{content?.name}</AlertDialog.Description>
          <AlertDialog.Title className="AlertDialogTitle"> Description</AlertDialog.Title>
          <AlertDialog.Description className="AlertDialogDescription">{content?.description}</AlertDialog.Description>
          <AlertDialog.Title className="AlertDialogTitle"> TODO Items</AlertDialog.Title>

          <div className="AlertDialogDescription">

            <List
              color="primary"
              items={tasks}
              size="medium"
              style={{
                textAlign: 'center',

              }}
              inactive
              variant="bordered"
            />
          </div>
          <div style={{ display: 'flex', gap: 25, justifyContent: 'center' }}>
            <AlertDialog.Cancel asChild>
              <button className="Button mauve">Close</button>
            </AlertDialog.Cancel>

          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
};

export default AlertDialogDemo;