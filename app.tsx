import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import { TodoListPage } from './components/TodoListPage/TodoListPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TodoStore } from './stores/todoStore';
import { TodoStoreProvider } from './shared/TodoStoreProvider';
import { Container } from '@mui/material';
import styles from 'App.scss';
import { LocalizationProvider } from '@mui/x-date-pickers';
import DateFnsAdapter from '@date-io/moment';
import { MyAppBar } from './components/MyAppBar/MyAppBar';

const store = new TodoStore();

export const App = observer(() => {
  return (
    <TodoStoreProvider store={store}>
      <LocalizationProvider dateAdapter={DateFnsAdapter}>
        <Container maxWidth="sm" className={styles.container}>
          <MyAppBar />
          <Routes>
            <Route path="/todos/*" element={<TodoListPage />} />
            <Route path="/todos/:id" element={<TodoListPage />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Container>
      </LocalizationProvider>
    </TodoStoreProvider>
  );
});
