// client/src/pages/Login.jsx
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutations/loginUser";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      console.log("Login successful:", data);

      dispatch({
        type: "LOGIN",
        payload: {
          token: data.login.token,
          user: data.login.user,
        },
      });

      localStorage.setItem("authToken", data.login.token);
      localStorage.setItem("user", JSON.stringify(data.login.user));

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          {error && <Typography color="error">Error: {error.message}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
