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
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Star as StarIcon, StarBorder as StarBorderIcon } from "@mui/icons-material";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});
  const [isEditing, setIsEditing] = useState(false);

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
      </Box>

      <Grid container spacing={3}>
        {todos.map((todo) => (
          <Grid item xs={12} md={6} lg={4} key={todo.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">{todo.title}</Typography>
                  <Tooltip title={todo.star ? "Unstar" : "Star"}>
                    <IconButton onClick={() => handleToggleStar(todo.id)}>{todo.star ? <StarIcon color="primary" /> : <StarBorderIcon />}</IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {todo.description}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="caption">Priority: {renderPriorityChip(todo.priority)}</Typography>
                  </Box>
                  <Typography variant="caption">End Date: {todo.endDate.toLocaleDateString()}</Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" startIcon={<EditIcon />} onClick={() => handleOpenEditDialog(todo)}>
                  Edit
                </Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Edit Todo" : "Add New Todo"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={currentTodo.title || ""}
            onChange={(e) => setCurrentTodo({ ...currentTodo, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={currentTodo.description || ""}
            onChange={(e) => setCurrentTodo({ ...currentTodo, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={currentTodo.status || "TODO"}
              label="Status"
              onChange={(e) =>
                setCurrentTodo({
                  ...currentTodo,
                  status: e.target.value,
                })
              }
            >
              <MenuItem value="TODO">Todo</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={currentTodo.priority || 1}
              label="Priority"
              onChange={(e) =>
                setCurrentTodo({
                  ...currentTodo,
                  priority: Number(e.target.value),
                })
              }
            >
              <MenuItem value={1}>Low</MenuItem>
              <MenuItem value={2}>Medium</MenuItem>
              <MenuItem value={3}>High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentTodo.endDate ? currentTodo.endDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setCurrentTodo({
                ...currentTodo,
                endDate: new Date(e.target.value),
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={isEditing ? handleEditTodo : handleAddTodo} color="primary">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
