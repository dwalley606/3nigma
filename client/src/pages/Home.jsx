// src/pages/Home.jsx

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to Your Messaging App</h1>
      <p>This is the home page of your messaging app. Use the navigation bar to explore different features.</p>
      <div style={styles.infoBox}>
        <h2>Features:</h2>
        <ul>
          <li>Chat with friends and family</li>
          <li>Manage your contacts</li>
          <li>Create and join groups</li>
          <li>Customize your profile and settings</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  infoBox: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

export default Home;