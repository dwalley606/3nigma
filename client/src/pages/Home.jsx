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
      navigate("/dashboard"); // Redirect to dashboard if user is authenticated
    }
  }, [state.user, navigate]);

  return (
    <Box sx={styles.container}>
      <Typography variant="h1" sx={styles.title}>
        Welcome to Your Messaging App
      </Typography>
      <Typography variant="body1" sx={styles.description}>
        Experience secure and seamless communication with our end-to-end
        encrypted messaging app. Access your messages anywhere with our
        Progressive Web App (PWA) capabilities.
      </Typography>
      <Box sx={styles.infoBox}>
        <Typography variant="h2" sx={styles.subtitle}>
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
      <Box sx={styles.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/signup")}
          sx={styles.button}
        >
          Sign Up
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/login")}
          sx={styles.button}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    marginBottom: "20px",
  },
  description: {
    marginBottom: "20px",
  },
  infoBox: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    textAlign: "left",
  },
  subtitle: {
    marginBottom: "10px",
  },
  buttonContainer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  button: {
    minWidth: "120px",
  },
};

export default Home;
