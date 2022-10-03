import { observer } from 'mobx-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodoStore } from '../../shared/TodoStoreProvider';
import styles from './Dashboard.scss';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { IconButton } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

export const Dashboard = observer(() => {
  const todoStore = useTodoStore();
  const navigate = useNavigate();

  const todoLists = todoStore.todoLists;

  const deleteTodoList = async (todoListId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    await todoStore.deleteTodoList(todoListId);
  };

  return (
    <div className={styles.container}>
      <span>My todo lists: </span>
      {todoLists && todoLists.length > 0 ? (
        <div className={styles.todoLists}>
          {todoLists!.map(todoList => (
            <Card
              sx={{ maxWidth: 500, minWidth: 160 }}
              className={styles.todoCard}
              onClick={() => navigate(`/todos/${todoList.id}`)}
              key={`${todoList.id}`}
            >
              <CardContent className={styles.content}>
                <span className={styles.title}>{todoList.title}</span>
                <IconButton className={styles.delete} onClick={event => deleteTodoList(todoList.id, event)}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <span>no todo lists</span>
      )}
    </div>
  );
});
