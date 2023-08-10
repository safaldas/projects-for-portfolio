import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import './style.css';
import TaskForm from '../TaskForm';
import CloseIcon from '../../assets/close.png';

const AddProject = () => {

return(    

  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
    <div>Add Project</div>
      
    </AlertDialog.Trigger>
   
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="AlertDialogOverlay" />
      <AlertDialog.Content className="AlertDialogContent">
        <div style={{display:'flex', justifyContent:'space-between'}}>
        <AlertDialog.Title className="AlertDialogTitle"> Add New Project</AlertDialog.Title>
        <AlertDialog.Cancel asChild>
     
     <img src={CloseIcon} alt="Gray X icon" width={10} height={10}/>
   </AlertDialog.Cancel>
   </div>
        <AlertDialog.Description className="AlertDialogDescription">
        <TaskForm/>
        </AlertDialog.Description>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
)
};

export default AddProject;