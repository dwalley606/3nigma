import mongoose from "mongoose";
import User from "../models/User.js";
import ContactRequest from "../models/ContactRequest.js";
import Message from "../models/Message.js";
import Group from "../models/Group.js";
import Conversation from "../models/Conversation.js";

// Connect to your MongoDB database
mongoose.connect("mongodb://localhost:27017/3nigma", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await ContactRequest.deleteMany({});
    await Message.deleteMany({});
    await Group.deleteMany({});
    await Conversation.deleteMany({});

    // Create and save 10 sample users individually
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = new User({
        username: `User${i}`,
        email: `user${i}@example.com`,
        password: "password", // Plain password, hashing handled in the model
        phoneNumber: `12345678${i}`,
        publicKey: `publicKeyUser${i}`,
        lastSeen: new Date().toISOString(),
        profilePicUrl: `https://example.com/user${i}.jpg`,
        contacts: [], // Initialize contacts array
      });
      await user.save(); // This will trigger the pre-save middleware
      users.push(user);
    }

    console.log("Users inserted:", users.length);

    // Generate contacts for each user
    for (const user of users) {
      // Randomly select 3 unique users as contacts
      const contactIds = new Set();
      while (contactIds.size < 3) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (randomUser._id.toString() !== user._id.toString()) {
          contactIds.add(randomUser._id);
        }
      }
      user.contacts = Array.from(contactIds); // Convert Set to Array
      await user.save(); // Save the user with updated contacts
    }

    console.log("Contacts added for each user.");

    // Create a group and assign users to it
    const groupMembers = users.slice(0, 5); // First 5 users in a group
    const group = new Group({
      name: "Group1",
      members: groupMembers.map((user) => user._id),
      admins: [groupMembers[0]._id],
      createdAt: new Date().toISOString(),
      description: "This is Group1",
    });
    await group.save();

    // Create group messages
    const groupMessages = [];
    for (const user of groupMembers) {
      for (let j = 0; j < 3; j++) {
        const message = new Message({
          sender: user._id,
          groupRecipientId: group._id,
          content: `Message ${j} from ${user.username} to Group1`,
          timestamp: new Date().toISOString(),
          read: false,
          isGroupMessage: true,
        });
        groupMessages.push(message);
      }
    }
    const insertedGroupMessages = await Message.insertMany(groupMessages);

    // Create group conversation with name field
    const groupConversation = new Conversation({
      participants: groupMembers.map((user) => user._id),
      isGroup: true,
      messages: insertedGroupMessages.map((msg) => msg._id), // Store message IDs
      lastMessage: insertedGroupMessages[insertedGroupMessages.length - 1]._id, // Set lastMessage to the last inserted message
      name: group.name, // Add the name field for the group conversation
      updatedAt: new Date().toISOString(),
    });
    await groupConversation.save();

    // Create non-group (direct) conversations and messages
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const conversation = new Conversation({
          participants: [users[i]._id, users[j]._id],
          isGroup: false,
          messages: [], // Initialize messages array
          lastMessage: null,
          updatedAt: new Date().toISOString(),
        });
        await conversation.save();

        const messages = [];
        for (let k = 0; k < 3; k++) {
          const message = new Message({
            sender: users[i]._id,
            userRecipientId: users[j]._id,
            content: `Direct message ${k} from ${users[i].username} to ${users[j].username}`,
            timestamp: new Date().toISOString(),
            read: false,
            isGroupMessage: false,
          });
          messages.push(message);
        }
        const insertedDirectMessages = await Message.insertMany(messages);

        // Update messages and lastMessage for direct conversation
        if (insertedDirectMessages.length > 0) {
          conversation.messages = insertedDirectMessages.map((msg) => msg._id);
          conversation.lastMessage =
            insertedDirectMessages[insertedDirectMessages.length - 1]._id; // Set lastMessage to the last inserted message
          await conversation.save();
        }
      }
    }

    console.log(
      "Database seeded successfully with conversations and messages!"
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
