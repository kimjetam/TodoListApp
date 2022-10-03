import * as yup from 'yup';

export const todoItemValidationSchema = yup.object().shape({
    title: yup.string().min(3).max(20).required("This field is required"),
    description: yup.string().max(100),
    deadline: yup.date().required("This field is required"),
    isDone: yup.boolean()
});

export const todoListValidationSchema = yup.object().shape({
    title: yup.string().min(3).max(20).required("This field is required"),
});