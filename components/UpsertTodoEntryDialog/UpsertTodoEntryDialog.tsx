import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { TodoItem } from '../../shared/models';
import styles from './UpsertTodoEntryDialog.scss';
import { todoItemValidationSchema } from '../../shared/validationSchemas';

interface UpsertTodoEntryDialogProps {
  open: boolean;
  todoItem?: TodoItem;
  onClose: () => void;
  onSubmit: (todoItem: TodoItem) => void;
  isCreating: boolean;
}

export const UpsertTodoEntryDialog = observer(({ open, onClose, todoItem, onSubmit, isCreating }: UpsertTodoEntryDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  const { values, errors, dirty, touched, handleSubmit, handleChange, setFieldValue, handleBlur, handleReset, isValid } = useFormik({
    initialValues: { ...todoItem },
    onSubmit: (_, actions) => {
      onClose();
      actions.resetForm();
      return onSubmit(values);
    },
    validationSchema: todoItemValidationSchema
  });

  useEffect(() => {
    if (open === false) handleReset(null);
  }, [open]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{isCreating ? 'Create' : 'Edit'} todo item</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={6}>
              <TextField
                id="title"
                variant="standard"
                label="todo title"
                value={values.title}
                onChange={handleChange}
                error={errors.title !== undefined && touched.title}
                helperText={errors.title}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item md={4} xs={6}>
              <MobileDatePicker
                inputFormat="MM/DD/YYYY"
                label="deadline"
                onChange={value => setFieldValue('deadline', value)}
                value={values.deadline}
                renderInput={params => (
                  <TextField
                    variant="standard"
                    id="deadline"
                    error={errors.deadline !== undefined && touched.deadline}
                    helperText={errors.deadline}
                    onBlur={handleBlur}
                    {...params}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="description"
                label="description"
                style={{ width: '100%', resize: 'none' }}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.description !== undefined && touched.description}
                helperText={errors.description}
              />
            </Grid>
          </Grid>

          <div className={styles.buttonsControl}>
            <Button color="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button color="success" type="submit" disabled={!isValid || !dirty}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});
