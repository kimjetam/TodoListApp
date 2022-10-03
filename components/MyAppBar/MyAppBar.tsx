import { AppBar, Box, IconButton, Menu, MenuItem, TextField, Toolbar, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTodoStore } from '../../shared/TodoStoreProvider';
import { useLocation, useNavigate, useParams, useMatch } from 'react-router-dom';
import styles from './MyAppBar.scss';
import { TodoList } from '../../shared/models';
import { runInAction } from 'mobx';
import { useFormik } from 'formik';
import { todoListValidationSchema } from '../../shared/validationSchemas';

export const MyAppBar = observer(() => {
  const todoStore = useTodoStore();
  const navigate = useNavigate();
  const location = useLocation();

  const match = useMatch('/todos/:id');
  const id = match?.params?.id;
  let isCreatingNewTodoList = !id;

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  let todoList: TodoList | undefined = todoStore.getTodoList(id!);

  const handleMoreOptionsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const saveNewTodoTitle = async (title: string) => {
    if (isValid) {
      if (isCreatingNewTodoList) {
        navigate('/');
        todoStore.createNewTodoList(title);
      } else {
        todoStore.updateTodoTitle(title, id!);
      }
    }
    setIsEditingTitle(false);
  };

  const { values, errors, handleSubmit, handleChange, dirty, isValid, handleBlur } = useFormik({
    initialValues: { title: todoList?.title || '' },
    onSubmit: () => saveNewTodoTitle(values.title),
    validationSchema: todoListValidationSchema
  });

  const deleteList = async () => {
    handleMenuClose();
    if (id) {
      todoStore.deleteTodoList(id!);
      navigate('/');
    }
  };

  const menuId = 'primary-todolist-menu';
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = (): void => {
    setAnchorEl(null);
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
        <Toolbar>
          {location.pathname === '/' && (
            <>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Home
              </Typography>

              <IconButton size="large" edge="end" color="inherit" onClick={() => navigate(`/todos`)}>
                <AddIcon />
              </IconButton>
            </>
          )}
          {location.pathname.includes('todos') && (
            <>
              <IconButton className={styles.backButton} size="large" color="inherit" onClick={() => navigate('/')}>
                <ArrowBackIosIcon />
              </IconButton>

              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {isCreatingNewTodoList || isEditingTitle ? (
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
              {!isCreatingNewTodoList && (
                <IconButton size="large" aria-label="display more actions" edge="end" color="inherit" onClick={handleMoreOptionsOpen}>
                  <MoreVertIcon />
                </IconButton>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      {todoStore.loading && <LinearProgress />}
      {renderMenu}
    </Box>
  );
});
