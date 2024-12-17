import React from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { TodoApi } from "../../apis/TodoApi";
import toast from "react-hot-toast";
const TodoSchema = z.object({
  title: z.string(), // Required
  description: z.string().optional(),
  status: z.number().optional(),
  priority: z.number().optional(),
  createdDate: z.string().optional(), // Assuming ISO string format
  endDate: z.string().optional(), // Assuming ISO string format
  star: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
const TodoForm = ({ openDialog, closeDialog, isEditing }) => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      title: "",
      description: "",
      status: 0,
      priority: 0,
      createdDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      star: false,
      isActive: true,
    },
  });
  const handleOnSubmit = (data) => {
    TodoApi.createTodo(data).then((response) => {
      const { success, message } = response.data;
      if (!success) {
        toast.error(message);
        return;
      }
      toast.success(message);
      closeDialog();
    });
  };
  return (
    <Dialog open={openDialog} onClose={closeDialog}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <DialogTitle>{isEditing ? "Edit Todo" : "Add New Todo"}</DialogTitle>
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
                  <MenuItem value={0}>Todo</MenuItem>
                  <MenuItem value={1}>In Progress</MenuItem>
                  <MenuItem value={2}>Completed</MenuItem>
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
            render={({ field }) => <TextField {...field} margin="dense" label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />}
            name="startDate"
            control={control}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TodoForm;
