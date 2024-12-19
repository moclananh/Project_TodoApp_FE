import React, { useEffect } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { TodoApi } from "../../apis/TodoApi";
import toast from "react-hot-toast";
import { loginApi } from "../../apis/LoginApi";

const TodoSchema = z.object({
  title: z.string(), // Required
  description: z.string().optional(),
  status: z.number().optional(),
  priority: z.number().optional(),
  startDate: z.string().optional(), // Assuming ISO string format
  endDate: z.string().optional(), // Assuming ISO string format
  star: z.boolean().optional(),
  isActive: z.boolean().optional(),
  userId: z.string().optional(),
});

const EditTodoForm = ({ openDialog, closeDialog, onSuccess, todoId, todoData }) => {
  const { id } = loginApi.getUser();
  const todoStatus = {
    0: "Draft",
    1: "Todo",
    2: "InProgress",
    3: "Done",
    4: "Bug",
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      title: todoData?.title || "",
      description: todoData?.description || "",
      status: todoData?.status || 0,
      priority: todoData?.priority || 0,
      startDate: todoData?.startDate || new Date().toISOString(),
      endDate: todoData?.endDate || new Date().toISOString(),
      star: todoData?.star || false,
      isActive: todoData?.isActive || true,
      userId: id,
    },
  });

  useEffect(() => {
    if (todoData) {
      reset({
        title: todoData.title || "",
        description: todoData.description || "",
        status: todoData.status || 0,
        priority: todoData.priority || 0,
        startDate: todoData.startDate || new Date().toISOString(),
        endDate: todoData.endDate || new Date().toISOString(),
        star: todoData.star || false,
        isActive: todoData.isActive || true,
        userId: todoData.userId || id,
      });
    }
  }, [todoData, reset, id]);

  const handleOnSubmit = (data) => {
    TodoApi.updateTodo(todoId, data)
      .then((response) => {
        const { success, message } = response.data;
        if (!success) {
          toast.error(message);
          return;
        }
        toast.success(message);
        onSuccess();
        closeDialog();
      })
      .catch((error) => {
        toast.error("Error updating todo. Please try again.");
      });
  };

  return (
    <Dialog open={openDialog} onClose={closeDialog}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <DialogTitle>{"Edit Todo"}</DialogTitle>
        <DialogContent>
          <Controller render={({ field }) => <TextField {...field} margin="dense" label="Title" fullWidth />} name="title" control={control} />
          <Controller
            render={({ field }) => <TextField {...field} margin="dense" label="Description" fullWidth multiline rows={4} />}
            name="description"
            control={control}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Status">
                  {Object.entries(todoStatus).map(([key, value]) => (
                    <MenuItem key={key} value={Number(key)}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Priority">
                  <MenuItem value={0}>Low</MenuItem>
                  <MenuItem value={1}>Medium</MenuItem>
                  <MenuItem value={2}>High</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          <Controller
            render={({ field }) => <TextField {...field} margin="dense" label="Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />}
            name="startDate"
            control={control}
          />
          <Controller
            render={({ field }) => <TextField {...field} margin="dense" label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />}
            name="endDate"
            control={control}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Edit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTodoForm;
