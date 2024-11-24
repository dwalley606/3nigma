// src/pages/Home.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/StoreProvider";
import { Button, Box, Typography, Paper } from "@mui/material";

const Home = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.user) {
      navigate("/dashboard");
    }
  }, [state.user, navigate]);

  return (
    <Box sx={{
      padding: "20px",
      textAlign: "center",
      maxWidth: "600px",
      margin: "0 auto",
    }}>
      <Typography variant="h1" sx={{ marginBottom: "20px", fontSize: "3rem" }}>
        3nigma
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: "20px" }}>
      Welcome to my first full stack app, 3NIGMA. After recently graduating the flex coding bootcamp through George Washington University and EdX, I decided to set out building a full stack application that I could use to both hone my skills and display what I have learned. Being particularly security minded, I decided I would explore what it takes to build an end-to-end encrypted messaging app, and if possible utilize progressive web app techniques for ease of use.
      </Typography>
      <Paper sx={{
        marginTop: "20px",
        padding: "10px",
        borderRadius: "5px",
        textAlign: "left"
      }}>
        <Typography variant="h2" sx={{ marginBottom: "10px" }}>
          Active Features:
        </Typography>
        <ul>
          <li>Real-time chat with friends and family</li>
          <li>Optimistic state updates for a smooth user experience</li>
          <li>Keep track of contacts and groups</li>
        </ul>
        <Typography variant="h2" sx={{ marginBottom: "10px", marginTop: "20px" }}>
          In Development:
        </Typography>
        <ul>
          <li>HTTPS</li>
          <li>Websocket(socket.io)</li>
          <li>End-to-end encryption</li>
          <li>PWA Functionality</li>
        </ul>
      </Paper>
      <Box sx={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        gap: "10px"
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/signup")}
          sx={{ minWidth: "120px" }}
        >
          Sign Up
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/login")}
          sx={{ minWidth: "120px" }}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
