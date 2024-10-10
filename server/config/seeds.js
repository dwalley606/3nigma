const mongoose = require("mongoose");
const User = require("../models/User");
const ContactRequest = require("../models/ContactRequest");
const Message = require("../models/Message");
const Group = require("../models/Group");
const EncryptionKey = require("../models/EncryptionKey");

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
    await EncryptionKey.deleteMany({});

    // Create sample users
    const user1 = new User({
      username: "Alice",
      phoneNumber: "1234567890",
      publicKey: "publicKeyAlice",
      lastSeen: new Date().toISOString(),
    });

    const user2 = new User({
      username: "Bob",
      phoneNumber: "0987654321",
      publicKey: "publicKeyBob",
      lastSeen: new Date().toISOString(),
    });

    await user1.save();
    await user2.save();

    // Create a sample contact request
    const contactRequest = new ContactRequest({
      from: user1._id,
      to: user2._id,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    await contactRequest.save();

    // Create a sample message
    const message = new Message({
      sender: user1._id,
      recipient: user2._id,
      content: "Hello, Bob!",
      timestamp: new Date().toISOString(),
      read: false,
    });

    await message.save();

    // Create a sample group
    const group = new Group({
      name: "Friends",
      members: [user1._id, user2._id],
      messages: [message._id],
      admins: [user1._id],
      createdAt: new Date().toISOString(),
    });

    await group.save();

    // Create a sample encryption key
    const encryptionKey = new EncryptionKey({
      user: user1._id,
      publicKey: "publicKeyAlice",
      privateKey: "privateKeyAlice",
    });

    await encryptionKey.save();

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
