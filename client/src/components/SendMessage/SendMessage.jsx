import React from "react";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../mutations/sendMessage";
// import {
//   encryptSymmetricKey,
//   encryptMessageContent,
//   generateSymmetricKey,
// } from "../utils/encryption";

const SendMessageComponent = () => {
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleSendMessage = async () => {
    try {
      // const recipientPublicKey = "..."; // Retrieve the recipient's public key
      // const symmetricKey = generateSymmetricKey(); // Generate a symmetric key
      // const encryptedSymmetricKey = encryptSymmetricKey(
      //   symmetricKey,
      //   recipientPublicKey
      // );
      // const encryptedMessage = encryptMessageContent(
      //   "Hello, this is a secret message!",
      //   symmetricKey
      // );

      const { data } = await sendMessage({
        variables: {
          senderId: "user123",
          recipientId: "user456",
          content: "Hello, this is a secret message!",
          isGroupMessage: false,
        },
      });
      console.log("Message sent:", data.sendMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return <button onClick={handleSendMessage}>Send Message</button>;
};

export default SendMessageComponent;
