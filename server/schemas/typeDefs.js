type User {
  id: ID!
  username: String!
  phoneNumber: String!
  publicKey: String!          # Public key for encryption
  lastSeen: String!
  profilePicUrl: String
  contacts: [User!]!          # List of user's contacts
}

# Contact Requests for secure key exchange between users
type ContactRequest {
  id: ID!
  from: User!
  to: User!
  status: String!             # "pending", "accepted", "rejected"
  createdAt: String!
}

# Message model
type Message {
  id: ID!
  sender: User!
  recipient: User!
  content: String!            # Encrypted message content
  timestamp: String!
  read: Boolean!
  isGroupMessage: Boolean     # Distinguish between direct and group message
}

# Group conversation for group messaging
type Group {
  id: ID!
  name: String!
  members: [User!]!           # Group members
  messages: [Message!]!       # Group messages
  admins: [User!]!            # Group admins
  createdAt: String!
}

# Secure keys for end-to-end encryption
type EncryptionKey {
  id: ID!
  user: User!
  publicKey: String!          # User's public key for encryption
  privateKey: String!         # Private key stored securely on client (not server)
}

# Query Type
type Query {
  # Get a user's contacts
  getContacts(userId: ID!): [User!]!

  # Fetch a conversation between two users
  getMessages(senderId: ID!, recipientId: ID!): [Message!]!

  # Fetch a group conversation
  getGroupMessages(groupId: ID!): [Message!]!

  # Fetch user details
  getUser(id: ID!): User!

  # Fetch current user's key pair
  getEncryptionKey(userId: ID!): EncryptionKey!
}

# Mutation Type
type Mutation {
  # User registration with public key upload
  registerUser(username: String!, phoneNumber: String!, publicKey: String!): User!

  # User sends a message (direct or group)
  sendMessage(senderId: ID!, recipientId: ID!, content: String!, isGroupMessage: Boolean): Message!

  # Add contact by initiating a contact request
  sendContactRequest(fromUserId: ID!, toUserId: ID!): ContactRequest!

  # Accept or reject a contact request
  respondContactRequest(requestId: ID!, status: String!): ContactRequest!

  # Create a group with members
  createGroup(name: String!, memberIds: [ID!]!): Group!

  # Add a user to a group
  addGroupMember(groupId: ID!, userId: ID!): Group!

  # Remove a user from a group
  removeGroupMember(groupId: ID!, userId: ID!): Group!

  # Delete a message (for sender or everyone)
  deleteMessage(messageId: ID!, forEveryone: Boolean!): Boolean!
}

