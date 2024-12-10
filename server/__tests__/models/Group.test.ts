import mongoose from 'mongoose';
import Group, { IGroup } from '../../src/models/Group';
import User from '../../src/models/User'; // Assuming you have a User model

afterEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not connected');
  }
  const collections = await mongoose.connection.db!.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

describe('Group Model Test', () => {
  it('should create & save a group successfully', async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'testpassword' });    const validGroup: IGroup = new Group({
      name: 'Test Group',
      members: [user._id],
      admins: [user._id],
    });
    const savedGroup = await validGroup.save();

    expect(savedGroup._id).toBeDefined();
    expect(savedGroup.name).toBe(validGroup.name);
    expect(savedGroup.members).toContainEqual(user._id);
    expect(savedGroup.admins).toContainEqual(user._id);
  });

  it('should fail to create a group without required fields', async () => {
    const groupWithoutRequiredField = new Group({ members: [] });
    let err: mongoose.Error.ValidationError | undefined;
    try {
      await groupWithoutRequiredField.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }
    expect(err).toBeDefined();
    expect(err!.errors.name).toBeDefined();
  });

  it('should update a group successfully', async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'testpassword' });    const group = await Group.create({
      name: 'Initial Group',
      members: [user._id],
      admins: [user._id],
    });

    group.name = 'Updated Group';
    const updatedGroup = await group.save();

    expect(updatedGroup.name).toBe('Updated Group');
  });

  it('should delete a group successfully', async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'testpassword' });    const group = await Group.create({
      name: 'Group to Delete',
      members: [user._id],
      admins: [user._id],
    });

    await Group.findByIdAndDelete(group._id);
    const deletedGroup = await Group.findById(group._id);

    expect(deletedGroup).toBeNull();
  });
}); 