import { observer } from 'mobx-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTodoStore } from '../../shared/TodoStoreProvider';
import styles from './Dashboard.scss';

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
        <Grid container spacing={2} className={styles.todoLists}>
          {todoLists!.map(todoList => (
            <Grid item xs={12} sm={4} key={`${todoList.id}`}>
              <Card className={styles.todoCard} onClick={() => navigate(`/todos/${todoList.id}`)}>
                <CardContent className={styles.content}>
                  <span className={styles.title}>{todoList.title}</span>
                  <IconButton onClick={event => deleteTodoList(todoList.id, event)}>
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <span>no todo lists</span>
      )}
    </div>
  );
});
