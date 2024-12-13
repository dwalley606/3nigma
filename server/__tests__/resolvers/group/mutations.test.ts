import request from 'supertest';
import app from '../../../src/server.js'; // Adjust the path to your Express app
import User from '../../../src/models/User.js';
import Group from '../../../src/models/Group.js';
import Message from '../../../src/models/Message.js';
import Conversation from '../../../src/models/Conversation.js';

describe('Group Mutations', () => {
  let userId: string;
  let groupId: string;

  beforeEach(async () => {
    // Create a user for testing
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      phoneNumber: '1234567890',
    });
    userId = user._id.toString();
  });

  it('should create a group', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            createGroup(name: "Test Group", memberIds: ["${userId}"]) {
              id
              name
              members {
                id
                username
              }
              createdAt
            }
          }
        `,
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    expect(response.status).toBe(200);
    expect(response.body.data.createGroup).toHaveProperty('id');
    expect(response.body.data.createGroup.name).toBe('Test Group');
    groupId = response.body.data.createGroup.id; // Store the groupId for further tests
  });

  it('should add a user to a group', async () => {
    // First, create a group
    const group = await Group.create({
      name: 'Another Group',
      members: [userId],
      admins: [userId],
      createdAt: new Date().toISOString(),
    });
    groupId = group._id.toString();

    const newUser = await User.create({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password',
      phoneNumber: '0987654321',
    });

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            addUserToGroup(groupId: "${groupId}", userId: "${newUser._id}") {
              id
              name
              members {
                id
                username
              }
            }
          }
        `,
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    expect(response.status).toBe(200);
    expect(response.body.data.addUserToGroup.members).toHaveLength(2); // Check if the new user was added
  });

  it('should promote a user to admin', async () => {
    // Create a group and promote the user
    const group = await Group.create({
      name: 'Group to Promote',
      members: [userId],
      admins: [userId],
      createdAt: new Date().toISOString(),
    });
    groupId = group._id.toString();

    const newUser = await User.create({
      username: 'promotableuser',
      email: 'promotable@example.com',
      password: 'password',
      phoneNumber: '1234567890',
    });

    // Add the new user to the group first
    await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            addUserToGroup(groupId: "${groupId}", userId: "${newUser._id}") {
              id
            }
          }
        `,
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            promoteToAdmin(groupId: "${groupId}", userId: "${newUser._id}") {
              id
              admins {
                id
                username
              }
            }
          }
        `,
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    expect(response.status).toBe(200);
    expect(response.body.data.promoteToAdmin.admins).toContainEqual(
      expect.objectContaining({ id: newUser._id.toString() })
    );
  });

  it('should remove a user from a group', async () => {
    // Create a group and add a user
    const group = await Group.create({
      name: 'Group to Remove From',
      members: [userId],
      admins: [userId],
      createdAt: new Date().toISOString(),
    });
    groupId = group._id.toString();

    const newUser = await User.create({
      username: 'removableuser',
      email: 'removable@example.com',
      password: 'password',
      phoneNumber: '1234567890',
    });

    // Add the new user to the group first
    await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            addUserToGroup(groupId: "${groupId}", userId: "${newUser._id}") {
              id
            }
          }
        `,
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            removeGroupMember(groupId: "${groupId}", userId: "${newUser._id}") {
              id
              members {
                id
                username
              }
            }
          }
        `,
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    expect(response.status).toBe(200);
    expect(response.body.data.removeGroupMember.members).not.toContainEqual(
      expect.objectContaining({ id: newUser._id.toString() })
    );
  });
});
