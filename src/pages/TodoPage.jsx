import { Add as AddIcon, Search } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Button, Container, InputAdornment, Pagination, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../components/forms/AuthContext";
import Grid from "@mui/material/Grid2";
import { isEmpty } from "lodash";
import toast from "react-hot-toast";
import { TodoApi } from "../apis/TodoApi";
import { TodoCard } from "../components/card/todo-card";
import TodoForm from "../components/forms/TodoForm";
import FilterBox from "../components/FilterBox";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { logout } = useAuth();
  const [filter, setFilter] = useState();
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTodo({});
    setIsEditing(false);
  };
  console.log(todos);
  const handleFilter = (filter) => {
    const cleanedFilter = Object.fromEntries(Object.entries(filter).filter(([_, value]) => value !== "" && value !== null && value !== undefined));
    setFilter(cleanedFilter);
  };
  useEffect(() => {
    TodoApi.getTodos(filter).then((response) => {
      const { success, message, data } = response.data;
      if (!success) {
        toast.error(message);
        return;
      }
      setTodos(data);
    });
  }, [filter]);

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
        <Stack alignItems={"center"} gap={4} variant="standard" flexDirection={"row"}>
          <Typography variant="h4">Todo List</Typography>
          <FilterBox onFilter={handleFilter} />
        </Stack>
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
      {isEmpty(todos) && <Typography variant="h6">No todo found</Typography>}

      <Grid container spacing={3} alignItems={"stretch"}>
        {todos.map((todo) => (
          <Grid key={todo.id} size={4} height={"100%"}>
            <TodoCard todo={todo} />
          </Grid>
        ))}
      </Grid>
      <Stack flexDirection={"row"} justifyContent={"center"} my="20px">
        <Pagination count={10} />
      </Stack>

      <TodoForm closeDialog={handleCloseDialog} isEditing={isEditing} openDialog={openDialog} />
    </Container>
  );
}
