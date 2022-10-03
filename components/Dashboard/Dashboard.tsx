import { observer } from 'mobx-react';
import * as React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTodoStore } from '../../shared/TodoStoreProvider';
import styles from './Dashboard.scss';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const Dashboard = observer(() => {
  const store = useTodoStore();
  const navigate = useNavigate();

  const todoLists = store.todoLists;

  const createList = () => {};

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Home
            </Typography>

            <IconButton size="large" edge="end" color="inherit" onClick={() => navigate(`/todos`)}>
              <AddIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>

      <div className={styles.container}>
        My todo lists:
        <div className={styles.todoLists}>
          {todoLists &&
            todoLists!.map(todoList => (
              <Card
                sx={{ maxWidth: 600, minWidth: 170 }}
                className={styles.todoCard}
                onClick={() => navigate(`/todos/${todoList.id}`)}
                key={`${todoList.id}`}
              >
                <CardContent>
                  <Typography>{todoList.title}</Typography>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
});
