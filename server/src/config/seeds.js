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
        password: "password",
        phoneNumber: `12345678${i}`,
        publicKey: `publicKeyUser${i}`,
        lastSeen: new Date().toISOString(),
        profilePicUrl: `https://example.com/user${i}.jpg`,
        contacts: [],
        groups: [],
      });
      await user.save();
      users.push(user);
    }

    console.log("Users inserted:", users.length);

    // Generate mutual contacts for each user
    for (let i = 0; i < users.length; i++) {
      const userA = users[i];
      const contactIds = new Set(userA.contacts);

      while (contactIds.size < 3) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const userB = users[randomIndex];

        if (userA._id.toString() !== userB._id.toString() && !contactIds.has(userB._id)) {
          contactIds.add(userB._id);
          userB.contacts.push(userA._id); // Ensure mutual contact
          await userB.save();
        }
      }

      userA.contacts = Array.from(contactIds);
      await userA.save();
    }

    console.log("Mutual contacts added for each user.");

    // Create a group and assign users to it
    const groupMembers = users.slice(0, 5);
    const group = new Group({
      name: "Group1",
      members: groupMembers.map((user) => user._id),
      admins: [groupMembers[0]._id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await group.save();

    console.log("Group created with ID:", group._id);

    // Update each user's groups field with the correct groupId
    for (const member of groupMembers) {
      member.groups.push(group._id);
      await member.save();
    }

    console.log("Group IDs added to users' groups field.");

    // Create group messages
    const groupMessages = [];
    for (const user of groupMembers) {
      for (let j = 0; j < 3; j++) {
        const message = new Message({
          sender: user._id,
          groupRecipientId: group._id,
          content: `Message ${j} from ${user.username} to Group1`,
          timestamp: new Date().toISOString(),
          isGroupMessage: true,
        });
        groupMessages.push(message);
      }
    }
    const insertedGroupMessages = await Message.insertMany(groupMessages);

    // Create group conversation
    const groupConversation = new Conversation({
      participants: groupMembers.map((user) => user._id),
      isGroup: true,
      messages: insertedGroupMessages.map((msg) => msg._id),
      lastMessage: insertedGroupMessages[insertedGroupMessages.length - 1]._id,
      name: group.name,
      groupId: group._id,
    });
    await groupConversation.save();

    console.log("Group conversation created.");

    // Create non-group (direct) conversations and messages only between mutual contacts
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const userA = users[i];
        const userB = users[j];

        // Check if they are mutual contacts
        if (userA.contacts.includes(userB._id) && userB.contacts.includes(userA._id)) {
          const conversation = new Conversation({
            participants: [userA._id, userB._id],
            isGroup: false,
            messages: [],
            lastMessage: null,
          });
          await conversation.save();

          const messages = [];
          for (let k = 0; k < 3; k++) {
            const message = new Message({
              sender: userA._id,
              userRecipientId: userB._id,
              content: `Direct message ${k} from ${userA.username} to ${userB.username}`,
              timestamp: new Date().toISOString(),
              isGroupMessage: false,
            });
            messages.push(message);
          }
          const insertedDirectMessages = await Message.insertMany(messages);

          if (insertedDirectMessages.length > 0) {
            conversation.messages = insertedDirectMessages.map((msg) => msg._id);
            conversation.lastMessage = insertedDirectMessages[insertedDirectMessages.length - 1]._id;
            await conversation.save();
          }
        }
      }
    }

    console.log("Database seeded successfully with conversations and messages!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
