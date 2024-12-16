import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Star as StarIcon, StarBorder as StarBorderIcon } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../components/forms/AuthContext";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TodoCard } from "../components/card/todo-card";
import { TodoApi } from "../apis/TodoApi";

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
const todo = {
  title: "Complete Homework",
  description: "Finish the math and science assignments.",
  status: "Todo",
  priority: 2,
  createdDate: "2024-12-16T14:26:35.378Z",
  endDate: "2024-12-20T14:26:35.378Z",
  star: true,
  isActive: true,
};
export default function TodoPage() {
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
  const [todos, setTodos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { logout } = useAuth();

  const handleAddTodo = () => {
    const newTodo = {
      id: todos.length + 1,
      title: currentTodo.title || "",
      description: currentTodo.description || "",
      status: currentTodo.status || "TODO",
      priority: currentTodo.priority || 1,
      createdDate: new Date(),
      endDate: currentTodo.endDate || new Date(),
      star: currentTodo.star || false,
      isActive: true,
    };

    setTodos([...todos, newTodo]);
    handleCloseDialog();
  };

  const handleEditTodo = () => {
    if (currentTodo.id) {
      const updatedTodos = todos.map((todo) => (todo.id === currentTodo.id ? { ...todo, ...currentTodo } : todo));
      setTodos(updatedTodos);
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTodo({});
    setIsEditing(false);
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleStar = (id) => {
    const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, star: !todo.star } : todo));
    setTodos(updatedTodos);
  };

  const handleOpenEditDialog = (todo) => {
    setCurrentTodo(todo);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const renderPriorityChip = (priority) => {
    const colors = ["success", "warning", "error"];
    const labels = ["Low", "Medium", "High"];
    const index = Math.min(priority - 1, 2);

    return <Chip label={labels[index]} color={colors[index]} size="small" />;
  };
  const handleOnSubmit = (data) => {
    TodoApi.createTodo(data).then((response) => {
      console.log(response);
    });
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 4,
        }}
      >
        <Typography variant="h4">Todo List</Typography>
        <Stack flexDirection={"row"} gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenDialog(true);
              setIsEditing(false);
            }}
          >
            Add Todo
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4} key={todo.id}>
            <TodoCard todo={todo} />
          </Grid>
          <Grid item xs={12} md={6} lg={4} key={todo.id}>
            <TodoCard todo={todo} />
          </Grid>
          <Grid item xs={12} md={6} lg={4} key={todo.id}>
            <TodoCard todo={todo} />
          </Grid>
          <Grid item xs={12} md={6} lg={4} key={todo.id}>
            <TodoCard todo={todo} />
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
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
              render={({ field }) => (
                <TextField {...field} margin="dense" label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
              )}
              name="startDate"
              control={control}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              {isEditing ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
