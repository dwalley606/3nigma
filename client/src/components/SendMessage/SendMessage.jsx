import React from "react";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE_MUTATION } from "../graphql/mutations/sendMessage";
import {
  encryptSymmetricKey,
  encryptMessageContent,
  generateSymmetricKey,
} from "../utils/encryption";

const SendMessageComponent = () => {
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);

  const handleSendMessage = async () => {
    try {
      const recipientPublicKey = "..."; // Retrieve the recipient's public key
      const symmetricKey = generateSymmetricKey(); // Generate a symmetric key
      const encryptedSymmetricKey = encryptSymmetricKey(
        symmetricKey,
        recipientPublicKey
      );
      const encryptedMessage = encryptMessageContent(
        "Hello, this is a secret message!",
        symmetricKey
      );

      const { data } = await sendMessage({
        variables: {
          senderId: "1",
          recipientId: "2",
          content: encryptedMessage,
          isGroupMessage: false,
        },
      });
      console.log("Message sent:", data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return <button onClick={handleSendMessage}>Send Message</button>;
};

export default SendMessageComponent;
