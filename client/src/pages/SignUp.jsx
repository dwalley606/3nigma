import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { REGISTER_USER } from "../graphql/mutations/registerUser";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await registerUser({
        variables: { username, email, password, phoneNumber },
      });
      console.log("User registered:", response.data.registerUser);
      setShowAlert(true);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    navigate("/login");
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
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
          {error && (
            <Typography color="error">Error signing up: {error.message}</Typography>
          )}
        </Box>
        {showAlert && (
          <Alert severity="success" onClose={handleAlertClose} sx={{ mt: 2 }}>
            Registration successful! Please log in.
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default SignUp;
