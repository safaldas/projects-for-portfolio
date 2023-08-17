import React, { useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import './style.css';
import TaskForm from '../TaskForm';
import CloseIcon from '../../assets/close.png';

const AddProject = (props) => {

  const [open, setOpen] = useState(props.open);

  return (

    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <div>Add Project</div>

      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AlertDialogContent">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <AlertDialog.Title className="AlertDialogTitle"> Add New Project</AlertDialog.Title>
            <AlertDialog.Cancel asChild>

              <img src={CloseIcon} onClick={() => setOpen(false)} alt="Gray X icon" width={10} height={10} />
            </AlertDialog.Cancel>
          </div>
          <div className="AlertDialogDescription">
            <TaskForm setOpen={setOpen} />
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
};

export default AddProject;