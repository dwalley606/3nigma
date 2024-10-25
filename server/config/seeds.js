import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import ContactRequest from "../models/ContactRequest.js";
import Message from "../models/Message.js";
import Group from "../models/Group.js";

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

    // Create multiple sample users
    const users = [];
    for (let i = 0; i < 50; i++) {
      const hashedPassword = await bcrypt.hash("password", 10); // Hash the password
      const user = new User({
        username: `User${i}`,
        email: `user${i}@example.com`, // Generate email
        password: hashedPassword, // Use hashed password
        phoneNumber: `12345678${i}`,
        publicKey: `publicKeyUser${i}`,
        lastSeen: new Date().toISOString(),
        groups: [], // Initialize groups array
      });
      users.push(user);
    }
    await User.insertMany(users);

    // Verify users are inserted
    console.log("Users inserted:", users.length);

    // Create groups and assign users to them
    const groups = [];
    const usersPerGroup = 5;
    for (let i = 0; i < 30; i++) {
      const startIndex = (i * usersPerGroup) % users.length;
      const endIndex = startIndex + usersPerGroup;
      const groupMembers = users.slice(startIndex, endIndex);

      // Debugging log
      console.log(
        `Group ${i} members:`,
        groupMembers.map((user) => user.username)
      );

      if (groupMembers.length < usersPerGroup) {
        console.error(`Not enough users to form group ${i}`);
        continue;
      }

      const group = new Group({
        name: `Group${i}`,
        members: groupMembers.map((user) => user._id),
        admins: [groupMembers[0]._id], // Assign the first user as admin
        createdAt: new Date().toISOString(),
      });
      groups.push(group);

      // Update each user's groups array
      for (const member of groupMembers) {
        member.groups.push(group._id);
        await member.save();
      }
    }
    await Group.insertMany(groups);

    // Create group messages
    const groupMessages = [];
    groups.forEach((group, groupIndex) => {
      const groupMembers = users.slice(
        (groupIndex * usersPerGroup) % users.length,
        ((groupIndex + 1) * usersPerGroup) % users.length
      );
      groupMembers.forEach((user) => {
        for (let j = 0; j < 3; j++) {
          // Each user sends 3 messages per group
          const message = new Message({
            senderId: user._id,
            senderName: user.username,
            recipientId: group._id, // Use group ID as recipient
            content: `Message ${j} from ${user.username} to Group${groupIndex}`,
            timestamp: new Date().toISOString(),
            read: false,
            isGroupMessage: true, // Mark as group message
            groupName: group.name, // Add groupName field
          });
          groupMessages.push(message);
        }
      });
    });
    await Message.insertMany(groupMessages);

    // Create one-on-one conversations
    const directMessages = [];
    users.forEach((user, userIndex) => {
      const otherUsers = users
        .filter((_, index) => index !== userIndex)
        .slice(0, 3); // Select 3 other users
      otherUsers.forEach((otherUser) => {
        for (let k = 0; k < 3; k++) {
          // Each user sends 3 messages to each of the 3 other users
          const message = new Message({
            senderId: user._id,
            senderName: user.username,
            recipientId: otherUser._id,
            content: `Direct message ${k} from ${user.username} to ${otherUser.username}`,
            timestamp: new Date().toISOString(),
            read: false,
            isGroupMessage: false, // Mark as direct message
          });
          directMessages.push(message);
        }
      });
    });
    await Message.insertMany(directMessages);

    console.log("Database seeded successfully with large data!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
