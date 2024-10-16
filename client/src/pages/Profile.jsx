import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../graphql/queries/getUserById';

const Profile = ({ userId }) => {
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { username, email, phoneNumber, publicKey, lastSeen, profilePicUrl, contacts } = data.getUserById;

  return (
    <div>
      <h1>{username}'s Profile</h1>
      <p>Email: {email}</p>
      <p>Phone Number: {phoneNumber}</p>
      <p>Public Key: {publicKey}</p>
      <p>Last Seen: {new Date(lastSeen).toLocaleString()}</p>
      {profilePicUrl && <img src={profilePicUrl} alt={`${username}'s profile`} />}
      <h2>Contacts</h2>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>{contact.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;