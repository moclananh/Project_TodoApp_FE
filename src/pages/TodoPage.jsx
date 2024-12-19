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
import EditForm from "../components/forms/EditForm";
import FilterBox from "../components/FilterBox";
import { loginApi } from "../apis/LoginApi";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const { id } = loginApi.getUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { logout } = useAuth();
  const [filter, setFilter] = useState({});
  const [totalPage, setTotalPage] = useState();
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setIsEdit(false);
    setSelectedTodoId(null);
  };

  const handleFilter = (filter) => {
    const cleanedFilter = Object.fromEntries(Object.entries(filter).filter(([_, value]) => value !== "" && value !== null && value !== undefined));
    setFilter(cleanedFilter);
  };
  const handleOnView = (todoId) => {
    setSelectedTodoId(todoId);
    setIsEdit(false);
    setOpenEditDialog(true);
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

  const handleOnEdit = (todoId) => {
    setSelectedTodoId(todoId);
    setIsEdit(true);
    setOpenEditDialog(true);
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

        const remainingItemsOnPage = todos.filter((todo) => todo.id !== todoId);
        if (remainingItemsOnPage.length === 0 && currentPageNumber > 1) {
          const newPage = currentPageNumber - 1;
          setCurrentPageNumber(newPage);
          setFilter((prev) => ({ ...prev, pageNumber: newPage }));
        } else {
          setTodos(remainingItemsOnPage);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
      });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 4 }}>
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
            }}
          >
            Add Todo
          </Button>
          <Button variant="contained" color="secondary" startIcon={<LogoutIcon />} onClick={() => logout()}>
            Logout
          </Button>
        </Stack>
      </Box>

      {isEmpty(todos) && <Typography variant="h6">No todo found</Typography>}

      <Grid container spacing={3}>
        {todos.map((todo) => (
          <Grid key={todo.id} size={3}>
            <TodoCard todo={todo} onEdit={handleOnEdit} onView={handleOnView} onDelete={handleOnDelete} />
          </Grid>
        ))}
      </Grid>

      <Stack flexDirection={"row"} justifyContent={"center"} my="20px">
        <Pagination
          count={isNaN(Math.ceil(totalPage / 10)) ? 0 : Math.ceil(totalPage / 10)}
          page={currentPageNumber}
          onChange={(e, page) => {
            setCurrentPageNumber(page);
            setFilter({ ...filter, pageNumber: page });
          }}
        />
      </Stack>

      <EditForm isEdit={isEdit} todoId={selectedTodoId} openDialog={openEditDialog} closeDialog={handleCloseEditDialog} onSuccess={handleOnSuccess} />

      <TodoForm openDialog={openDialog} closeDialog={handleCloseDialog} onSuccess={handleOnSuccess} />
    </Container>
  );
}
