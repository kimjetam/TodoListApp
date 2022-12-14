import { FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, Radio, RadioGroup, TextField } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { action } from 'mobx';
import { useTodoStore } from '../../shared/TodoStoreProvider';
import styles from './TodoListPage.scss';
import { TodoEntry } from '../TodoEntry/TodoEntry';
import { UpsertTodoEntryDialog } from '../UpsertTodoEntryDialog/UpsertTodoEntryDialog';
import { TodoItem, TodoList } from '../../shared/models';

export const TodoListPage = observer(() => {
  const { id } = useParams();
  const todoStore = useTodoStore();
  const navigate = useNavigate();
  const isOnCreatePage = !id;
  const todoList: TodoList | undefined = todoStore.getTodoList(id);

  useEffect(
    action(() => {
      if (!todoStore.loading && todoList === undefined && !isOnCreatePage) navigate('/');
    }),
    [todoStore.loading]
  );

  const [openDialog, setOpenDialog] = React.useState(false);

  const [filterByStatus, setFilterByStatus] = React.useState('all');
  const [textFilter, setTextFilter] = React.useState('');

  const handleAddTodoSubmit = (todoItemNew: TodoItem) => {
    todoStore.addTodoItem(id!, todoItemNew);
  };

  const renderTodos = (): JSX.Element[] | JSX.Element | null => {
    if (todoList === undefined) {
      return null;
    }

    const result = todoList.todos.filter(todo => {
      const textMatch =
        todo.title.toLowerCase().includes(textFilter.toLowerCase()) || todo.description.toLowerCase().includes(textFilter.toLowerCase());
      if (filterByStatus === 'all') return textMatch;
      return (filterByStatus === 'done' ? todo.isDone : !todo.isDone) && textMatch;
    });

    return result.length === 0 ? (
      <div>No results.</div>
    ) : (
      result.map((todo, idx) => <TodoEntry todoItemIdx={idx} todoListId={id!} todoItem={todo} key={`${todo.title}_${idx}`} />)
    );
  };

  return (
    <>
      <div className={styles.container}>
        {todoList && todoList.todos && todoList.todos.length > 0 ? (
          <>
            <div className={styles.filterGroup}>
              <TextField
                label="Text filter"
                variant="standard"
                size="small"
                value={textFilter}
                onChange={event => setTextFilter(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setTextFilter('')} edge="end">
                        <HighlightOffIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <FormControl>
                <FormLabel id="filter-by-status-radio-group-label ">Filter by status</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="filter-by-status-radio-group-label"
                  name="row-radio-buttons-group"
                  value={filterByStatus}
                  onChange={event => setFilterByStatus(event.target.value)}
                  id="filter-by-status-radio-group"
                >
                  <FormControlLabel value="all" control={<Radio />} label="All" />
                  <FormControlLabel value="inprogress" control={<Radio />} label="In progress" />
                  <FormControlLabel value="done" control={<Radio />} label="Done" />
                </RadioGroup>
              </FormControl>
            </div>

            <div className={styles.scrollable}>{renderTodos()}</div>
          </>
        ) : (
          <>{isOnCreatePage ? <div>Enter title!</div> : <div>This list is empty.</div>}</>
        )}

        {!isOnCreatePage && (
          <IconButton onClick={() => setOpenDialog(true)}>
            <AddCircleIcon />
          </IconButton>
        )}
      </div>

      <UpsertTodoEntryDialog
        isCreating
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        todoItem={{ deadline: null, description: '', isDone: false, title: '' } as TodoItem}
        onSubmit={handleAddTodoSubmit}
      />
    </>
  );
});
