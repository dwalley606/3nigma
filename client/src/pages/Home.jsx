// src/pages/Home.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/StoreProvider";
import { Button, Box, Typography } from "@mui/material";

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
      marginTop: "10vh"
    }}>
      <Typography variant="h1" sx={{ marginBottom: "20px" }}>
        Welcome to Your Messaging App
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: "20px" }}>
        Experience secure and seamless communication with our end-to-end
        encrypted messaging app. Access your messages anywhere with our
        Progressive Web App (PWA) capabilities.
      </Typography>
      <Box sx={{
        marginTop: "20px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
        textAlign: "left"
      }}>
        <Typography variant="h2" sx={{ marginBottom: "10px" }}>
          Features:
        </Typography>
        <ul>
          <li>End-to-end encryption for secure messaging</li>
          <li>Progressive Web App for offline access</li>
          <li>Real-time chat with friends and family</li>
          <li>Manage your contacts and groups</li>
          <li>Customize your profile and settings</li>
        </ul>
      </Box>
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
