// src/components/Message/Message.jsx
import PropTypes from "prop-types";
import { Box, Typography, Paper } from "@mui/material";

const Message = ({ message, isOwner }) => {
  const formattedTimestamp = new Date(
    parseInt(message.timestamp, 10)
  ).toLocaleString();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwner ? "flex-end" : "flex-start",
        mb: 1,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: "80%",
          padding: 2,
          borderRadius: 2,
          backgroundColor: isOwner ? "primary.main" : "secondary.main",
          color: isOwner ? "primary.contrastText" : "#0d0d0d",
        }}
      >
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          mb: 1,
          }}
        >
          <Typography variant="subtitle2" component="span">
            {message.sender ? message.sender.username : "Unknown User"}
          </Typography>
          <Typography variant="caption" component="span">
            {formattedTimestamp}
          </Typography>
        </Box>
        <Typography 
          variant="body1"
          sx={{
            color: isOwner ? "inherit": "black",
          }}>{message.content}</Typography>
      </Paper>
    </Box>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sender: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    isGroupMessage: PropTypes.bool,
  }).isRequired,
  isOwner: PropTypes.bool.isRequired,
};

export default Message;
