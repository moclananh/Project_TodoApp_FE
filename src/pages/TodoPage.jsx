import { Add as AddIcon, Search } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Button, Container, InputAdornment, Pagination, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../components/forms/AuthContext";
import Grid from "@mui/material/Grid2";
import { isEmpty, set } from "lodash";
import toast from "react-hot-toast";
import { TodoApi } from "../apis/TodoApi";
import { TodoCard } from "../components/card/todo-card";
import TodoForm from "../components/forms/TodoForm";
import FilterBox from "../components/FilterBox";
import { loginApi } from "../apis/LoginApi";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const { id } = loginApi.getUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { logout } = useAuth();
  const [filter, setFilter] = useState();
  const [totalPage, setTotalPage] = useState();
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTodo({});
    setIsEditing(false);
  };
  const handleFilter = (filter) => {
    const cleanedFilter = Object.fromEntries(Object.entries(filter).filter(([_, value]) => value !== "" && value !== null && value !== undefined));
    setFilter(cleanedFilter);
  };
  useEffect(() => {
    TodoApi.getByUserId(id, filter).then((response) => {
      const { success, message, data } = response.data;
      if (!success) {
        toast.error(message);
        return;
      }
      setTodos(data.items);
      setTotalPage(data.totalCount);
      setCurrentPageNumber(data.pageNumber);
    });
  }, [filter, id]);
  const handleOnEdit = (todo) => {
    setCurrentTodo(todo);
    setIsEditing(true);
    setOpenDialog(true);
  };
  const handleOnSuccess = () => {
    TodoApi.getTodos(filter).then((response) => {
      const { success, message, data } = response.data;
      if (!success) {
        toast.error(message);
        return;
      }
      setTodos(data.items);
      setTotalPage(data.totalCount);
      setCurrentPageNumber(data.pageNumber);
    });
  };

  const handleOnDelete = (todoId) => {
    TodoApi.deleteTodo(todoId)
      .then((response) => {
        const { success, message } = response.data;
        if (!success) {
          toast.error(message);
          return;
        }
        toast.success(message);
        setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
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

      <Grid container spacing={3}>
        {todos.map((todo) => (
          <Grid key={todo.id} size={4}>
            <TodoCard todo={todo} onEdit={handleOnEdit} onDelete={handleOnDelete} />
          </Grid>
        ))}
      </Grid>
      <Stack flexDirection={"row"} justifyContent={"center"} my="20px">
        <Pagination
          count={Math.ceil(totalPage / 9)}
          page={currentPageNumber}
          onChange={(e, page) => {
            setCurrentPageNumber(page);
            setFilter({ ...filter, pageNumber: page });
          }}
        />
      </Stack>

      <TodoForm onSuccess={handleOnSuccess} closeDialog={handleCloseDialog} isEditing={isEditing} openDialog={openDialog} todo={currentTodo} />
    </Container>
  );
}
