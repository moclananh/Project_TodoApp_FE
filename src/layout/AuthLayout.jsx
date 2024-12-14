import { Outlet } from "react-router";
import { Container } from "@mui/material";
const AuthLayout = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Outlet />
    </Container>
  );
};

export default AuthLayout;
