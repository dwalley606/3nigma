import request from 'supertest';
import app from '../../../src/server.js'; // Adjust the path to your Express app
import User from '../../../src/models/User.js';
import Group, { IGroup } from '../../../src/models/Group.js'; // Import the Group model type
import { MutationCreateGroupArgs, MutationAddUserToGroupArgs, MutationPromoteToAdminArgs, MutationRemoveGroupMemberArgs } from '../../../src/generated/graphql.js'; // Adjust the path to your generated types

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
    const variables: MutationCreateGroupArgs = {
      name: "Test Group",
      memberIds: [userId],
    };

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation CreateGroup($name: String!, $memberIds: [ID!]!) {
            createGroup(name: $name, memberIds: $memberIds) {
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
        variables,
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    expect(response.status).toBe(200);
    expect(response.body.data.createGroup).toHaveProperty('id');
    expect(response.body.data.createGroup.name).toBe('Test Group');
    groupId = response.body.data.createGroup.id; // Store the groupId for further tests
  });

  it('should add a user to a group', async () => {
    const group: IGroup = await Group.create({ // Explicitly type the group
      name: 'Another Group',
      members: [userId],
      admins: [userId],
      createdAt: new Date().toISOString(),
    });
    groupId = group._id.toString(); // Now this should work without error

    const newUser = await User.create({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password',
      phoneNumber: '0987654321',
    });

    const variables: MutationAddUserToGroupArgs = {
      groupId: groupId,
      userId: newUser._id.toString(),
    };

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation AddUserToGroup($groupId: ID!, $userId: ID!) {
            addUserToGroup(groupId: $groupId, userId: $userId) {
              id
              name
              members {
                id
                username
              }
            }
          }
        `,
        variables,
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    expect(response.status).toBe(200);
    expect(response.body.data.addUserToGroup.members).toHaveLength(2); // Check if the new user was added
  });

  it('should promote a user to admin', async () => {
    const group: IGroup = await Group.create({
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
          mutation AddUserToGroup($groupId: ID!, $userId: ID!) {
            addUserToGroup(groupId: $groupId, userId: $userId) {
              id
            }
          }
        `,
        variables: {
          groupId: groupId,
          userId: newUser._id.toString(),
        },
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    const variables: MutationPromoteToAdminArgs = {
      groupId: groupId,
      userId: newUser._id.toString(),
    };

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation PromoteToAdmin($groupId: ID!, $userId: ID!) {
            promoteToAdmin(groupId: $groupId, userId: $userId) {
              id
              admins {
                id
                username
              }
            }
          }
        `,
        variables,
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    expect(response.status).toBe(200);
    expect(response.body.data.promoteToAdmin.admins).toContainEqual(
      expect.objectContaining({ id: newUser._id.toString() })
    );
  });

  it('should remove a user from a group', async () => {
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
          mutation AddUserToGroup($groupId: ID!, $userId: ID!) {
            addUserToGroup(groupId: $groupId, userId: $userId) {
              id
            }
          }
        `,
        variables: {
          groupId: groupId,
          userId: newUser._id.toString(),
        },
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    const variables: MutationRemoveGroupMemberArgs = {
      groupId: groupId,
      userId: newUser._id.toString(),
    };

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation RemoveGroupMember($groupId: ID!, $userId: ID!) {
            removeGroupMember(groupId: $groupId, userId: $userId) {
              id
              members {
                id
                username
              }
            }
          }
        `,
        variables,
      })
      .set('Authorization', `Bearer YOUR_JWT_TOKEN`); // Replace with a valid JWT token

    expect(response.status).toBe(200);
    expect(response.body.data.removeGroupMember.members).not.toContainEqual(
      expect.objectContaining({ id: newUser._id.toString() })
    );
  });
});
