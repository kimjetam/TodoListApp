import {
  AppBar,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTodoStore } from '../../shared/TodoStoreProvider';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import styles from './TodoListPage.scss';
import CheckIcon from '@mui/icons-material/Check';
import { TodoEntry } from '../TodoEntry/TodoEntry';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { UpsertTodoEntryDialog } from '../UpsertTodoEntryDialog/UpsertTodoEntryDialog';
import { TodoItem, TodoList } from '../../models';
import { useFormik } from 'formik';
import { runInAction } from 'mobx';
import { todoListValidationSchema } from '../../validationSchemas';
import LinearProgress from '@mui/material/LinearProgress';

export const TodoListPage = observer(() => {
  const { id } = useParams();
  const todoStore = useTodoStore();
  const navigate = useNavigate();

  let todoList: TodoList | undefined;
  runInAction(() => (todoList = todoStore.getTodoList(id!)));

  const isOnCreatePage = !id;
  const [isEditingTitle, setIsEditingTitle] = useState(id === undefined);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { values, errors, handleSubmit, handleChange, dirty, isValid, handleBlur } = useFormik({
    initialValues: { title: todoList?.title || '' },
    onSubmit: () => saveNewTodoTitle(values.title),
    validationSchema: todoListValidationSchema
  });

  const [filterByStatus, setFilterByStatus] = React.useState('all');
  const [textFilter, setTextFilter] = React.useState('');

  const handleMoreOptionsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddTodoSubmit = (todoItemNew: TodoItem) => {
    todoStore.addTodoItem(id!, todoItemNew);
  };

  const deleteList = async () => {
    await todoStore.deleteTodoList(id!);
    navigate('/');
  };

  const saveNewTodoTitle = async (title: string) => {
    if (isValid) {
      if (isOnCreatePage) {
        navigate('/');
        await todoStore.createNewTodoList(title);
      } else {
        await todoStore.updateTodoTitle(title, id!);
      }
    }
    setIsEditingTitle(false);
  };

  const menuId = 'primary-todolist-menu';
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderTodos = () => {
    if (todoList === undefined) {
      return null;
    }

    const result = todoList.todos
      .filter(todo => {
        if (filterByStatus === 'all') return true;
        return filterByStatus === 'done' ? todo.isDone : !todo.isDone;
      })
      .filter(
        todo =>
          todo.title.toLowerCase().includes(textFilter.toLowerCase()) || todo.description.toLowerCase().includes(textFilter.toLowerCase())
      );

    return result.length === 0 ? (
      <div>No results.</div>
    ) : (
      result.map((todo, idx) => <TodoEntry todoItemIdx={idx} todoListId={id!} todoItem={todo} key={`${todo.title}_${idx}`} />)
    );
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          setIsEditingTitle(true);
          handleMenuClose();
        }}
      >
        Edit title
      </MenuItem>
      <MenuItem onClick={deleteList}>Delete</MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={styles.backButton} size="large" color="inherit" onClick={() => navigate('/')}>
              <ArrowBackIosIcon />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {isEditingTitle ? (
                <form onSubmit={handleSubmit}>
                  <TextField
                    variant="filled"
                    id="title"
                    size="small"
                    label="title"
                    className={styles.editTitleField}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                    error={errors.title !== undefined}
                    helperText={errors.title}
                  />
                  <IconButton color="inherit" type="submit" disabled={!isValid || !dirty}>
                    <CheckIcon />
                  </IconButton>
                </form>
              ) : (
                <>{todoList?.title}</>
              )}
            </Typography>
            {!isOnCreatePage && (
              <IconButton size="large" aria-label="display more actions" edge="end" color="inherit" onClick={handleMoreOptionsOpen}>
                <MoreVertIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        {todoStore.loading && <LinearProgress />}
        {renderMenu}
      </Box>

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
          <IconButton onClick={() => setOpen(true)}>
            <AddCircleIcon></AddCircleIcon>
          </IconButton>
        )}
      </div>

      <UpsertTodoEntryDialog
        open={open}
        onClose={() => setOpen(false)}
        todoItem={{ deadline: null, description: '', isDone: false, title: '' } as TodoItem}
        onSubmit={handleAddTodoSubmit}
      />
    </>
  );
});
