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
          maxWidth: "60%",
          padding: 2,
          borderRadius: 2,
          backgroundColor: isOwner ? "primary.main" : "grey.300",
          color: isOwner ? "primary.contrastText" : "text.primary",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle2" component="span">
            {message.senderName}
          </Typography>
          <Typography variant="caption" component="span">
            {formattedTimestamp}
          </Typography>
        </Box>
        <Typography variant="body1">{message.content}</Typography>
      </Paper>
    </Box>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    senderId: PropTypes.string.isRequired,
    senderName: PropTypes.string.isRequired,
    recipientId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    read: PropTypes.bool.isRequired,
    isGroupMessage: PropTypes.bool,
  }).isRequired,
  isOwner: PropTypes.bool.isRequired,
};

export default Message;
