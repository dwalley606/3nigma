import mongoose from 'mongoose';
import User, { IUser } from '../../src/models/User';

afterEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not connected');
  }
  const collections = await mongoose.connection.db!.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

describe('User Model Test', () => {
  it('should create & save a user successfully', async () => {
    const validUser: IUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword',
    });
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validUser.username);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.password).not.toBe('testpassword'); // Password should be hashed
  });

  it('should fail to create a user without required fields', async () => {
    const userWithoutRequiredField = new User({ username: 'testuser' });
    let err: mongoose.Error.ValidationError | undefined;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }
    expect(err).toBeDefined();
    expect(err!.errors.email).toBeDefined();
    expect(err!.errors.password).toBeDefined();
  });

  it('should update a user successfully', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword',
    });

    user.username = 'updateduser';
    const updatedUser = await user.save();

    expect(updatedUser.username).toBe('updateduser');
  });

  it('should delete a user successfully', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword',
    });

    await User.findByIdAndDelete(user._id);
    const deletedUser = await User.findById(user._id);

    expect(deletedUser).toBeNull();
  });

  it('should hash the password before saving', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword',
    });

    const savedUser = await user.save();
    expect(savedUser.password).not.toBe('testpassword');
  });
}); 