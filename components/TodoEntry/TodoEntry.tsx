import { Card, CardContent, Checkbox, Grid, IconButton, TextareaAutosize, TextField } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { TodoItem } from '../../shared/models';
import styles from './TodoEntry.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import { UpsertTodoEntryDialog } from '../UpsertTodoEntryDialog/UpsertTodoEntryDialog';
import { useTodoStore } from '../../shared/TodoStoreProvider';
import EditIcon from '@mui/icons-material/Edit';
import moment from 'moment';
import classNames from 'classnames';

interface TodoEntryProps {
  todoListId: string;
  todoItem: TodoItem;
  todoItemIdx: number;
}

export const TodoEntry = observer(({ todoItem, todoListId, todoItemIdx }: TodoEntryProps) => {
  const [open, setOpen] = React.useState(false);
  const todoStore = useTodoStore();

  const handleTodoEditSubmit = (todoItemNew: TodoItem) => {
    todoStore.updateTodoItem(todoListId, todoItemIdx, todoItemNew);
  };

  const handleTodoItemDelete = () => {
    todoStore.deleteTodoItem(todoListId, todoItemIdx);
  };

  const handleStatusChange = () => {
    todoStore.updateTodoItemStatus(todoListId, todoItemIdx, !todoItem.isDone);
  };
  return (
    <>
      <Card className={styles.card}>
        <form className={styles.form}>
          <Checkbox checked={todoItem.isDone} onChange={handleStatusChange} />
          <div className={classNames(styles.column, styles.info)}>
            <div className={styles.title}>{todoItem.title}</div>
            {todoItem.description && <div className={styles.description}>{todoItem.description}</div>}

            <span className={styles.deadline}>
              Due to: <span>{moment(todoItem.deadline).format('MM/DD/YYYY')}</span>
            </span>
          </div>
          <div className={classNames(styles.column, styles.end)}>
            <IconButton onClick={() => setOpen(true)}>
              <EditIcon color="warning"></EditIcon>
            </IconButton>
            <IconButton onClick={handleTodoItemDelete}>
              <DeleteIcon color="error"></DeleteIcon>
            </IconButton>
          </div>
        </form>
      </Card>
      <UpsertTodoEntryDialog
        open={open}
        onClose={() => setOpen(false)}
        todoItem={todoItem}
        onSubmit={handleTodoEditSubmit}
        isCreating={false}
      />
    </>
  );
});
