import mongoose from 'mongoose';
import ContactRequest from '../../src/models/ContactRequest';

describe('ContactRequest Model', () => {
  test('should create a contact request with valid fields', async () => {
    const from = new mongoose.Types.ObjectId();
    const to = new mongoose.Types.ObjectId();

    const contactRequest = new ContactRequest({
      from,
      to,
      status: 'pending'
    });

    const savedRequest = await contactRequest.save();
    
    expect(savedRequest._id).toBeDefined();
    expect(savedRequest.from.toString()).toBe(from.toString());
    expect(savedRequest.to.toString()).toBe(to.toString());
    expect(savedRequest.status).toBe('pending');
    expect(savedRequest.createdAt).toBeDefined();
  });

  test('should fail without required fields', async () => {
    const contactRequest = new ContactRequest({});
    
    await expect(contactRequest.save()).rejects.toThrow();
  });

  test('should fail with invalid status', async () => {
    const contactRequest = new ContactRequest({
      from: new mongoose.Types.ObjectId(),
      to: new mongoose.Types.ObjectId(),
      status: 'invalid_status'
    });

    await expect(contactRequest.save()).rejects.toThrow();
  });

  test('should set default status to pending', async () => {
    const contactRequest = new ContactRequest({
      from: new mongoose.Types.ObjectId(),
      to: new mongoose.Types.ObjectId()
    });

    const savedRequest = await contactRequest.save();
    expect(savedRequest.status).toBe('pending');
  });

  test('should set createdAt timestamp', async () => {
    const contactRequest = new ContactRequest({
      from: new mongoose.Types.ObjectId(),
      to: new mongoose.Types.ObjectId()
    });

    const savedRequest = await contactRequest.save();
    expect(savedRequest.createdAt).toBeDefined();
    expect(savedRequest.createdAt instanceof Date).toBeTruthy();
  });

  test('should update status to accepted', async () => {
    const contactRequest = await ContactRequest.create({
      from: new mongoose.Types.ObjectId(),
      to: new mongoose.Types.ObjectId()
    });

    contactRequest.status = 'accepted';
    const updatedRequest = await contactRequest.save();
    
    expect(updatedRequest.status).toBe('accepted');
  });
}); 