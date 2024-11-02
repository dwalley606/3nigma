import { createTheme } from '@mui/material/styles';

const cyberpunkTheme = createTheme({
  palette: {
    primary: {
      main: '#ff0055', // Neon pink
    },
    secondary: {
      main: '#00ffff', // Neon cyan
    },
    background: {
      default: '#0d0d0d', // Dark background
      paper: '#1a1a1a', // Slightly lighter dark for paper elements
    },
    text: {
      primary: '#e0e0e0', // Light grey for text
      secondary: '#ffcc00', // Yellow for secondary text
    },
    error: {
      main: '#ff3333', // Bright red for errors
    },
    warning: {
      main: '#ffcc00', // Bright yellow for warnings
    },
    info: {
      main: '#00ffff', // Cyan for info
    },
    success: {
      main: '#00ff00', // Bright green for success
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#ff0055', // Use primary color for headings
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#00ffff', // Use secondary color for subheadings
    },
    body1: {
      fontSize: '1rem',
      color: '#e0e0e0', // Light grey for body text
    },
    button: {
      textTransform: 'none', // Keep button text normal case
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners for buttons
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)', // Subtle shadow
        },
      },
    },
  },
});

export default cyberpunkTheme; 