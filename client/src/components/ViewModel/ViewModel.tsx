import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import './styles.css';
import {List } from '@phork/phorkit'


const AlertDialogDemo = (props) => {
    const {tasks, content} = props;

return(    

  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
      <button className="Button violet">View</button>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="AlertDialogOverlay" />
      <AlertDialog.Content className="AlertDialogContent">
      <AlertDialog.Title className="AlertDialogTitle"> Title</AlertDialog.Title>
        <AlertDialog.Description className="AlertDialogDescription">{content?.title}</AlertDialog.Description>
        <AlertDialog.Title className="AlertDialogTitle"> Description</AlertDialog.Title>
        <AlertDialog.Description className="AlertDialogDescription">{content?.body}</AlertDialog.Description>
        <AlertDialog.Title className="AlertDialogTitle"> TODO Items</AlertDialog.Title>

        <AlertDialog.Description className="AlertDialogDescription">

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
        </AlertDialog.Description>
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