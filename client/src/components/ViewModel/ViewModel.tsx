import React, { useEffect, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import './styles.css';
import { Accordion, List, Rhythm } from '@phork/phorkit'
// import mockCards from '../../data/cards'


const AlertDialogDemo = (props) => {
  const { content } = props;
  const [tasks, setTasks] = useState([]);
  const task = content?.tasks


  const description = (text) => {
    return <Rhythm >{text}</Rhythm>

  }

  const modalData = () => {
    for (let i = 0; i < task.length; i++) { // changed
      const card = {}
      card.content = description(task[i].description) //only for accordon if list not needed
      card.id = task[i].id;
      card.label = task[i].name;
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

          <div className="AlertDialogDescription">

            {/* <List
              color="primary"
              items={tasks}
              size="medium"
              style={{
                textAlign: 'center',

              }}
              inactive
              variant="bordered"
            /> */}

            <Accordion
              items={tasks}
              orientation="vertical"
              variant="primary"
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