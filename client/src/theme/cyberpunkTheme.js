import { createTheme } from "@mui/material/styles";

const cyberpunkTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: "#ff0055", // Neon pink
    },
    secondary: {
      main: "#00ffff", // Neon cyan
    },
    background: {
      default: "#0d0d0d", // Dark background
      paper: "#1a1a1a", // Slightly lighter dark for paper elements
    },
    text: {
      primary: "#e0e0e0", // Light grey for text
      secondary: "#ffcc00", // Yellow for secondary text
    },
    error: {
      main: "#ff3333", // Bright red for errors
    },
    warning: {
      main: "#ffcc00", // Bright yellow for warnings
    },
    info: {
      main: "#00ffff", // Cyan for info
    },
    success: {
      main: "#00ff00", // Bright green for success
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#ff0055", // Use primary color for headings
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#00ffff", // Use secondary color for subheadings
    },
    body1: {
      fontSize: "1rem",
      color: "#e0e0e0", // Light grey for body text
    },
    button: {
      textTransform: "none", // Keep button text normal case
    },
  },
  components: {
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#e0e0e0', // Replace with your desired color
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Rounded corners for buttons
          boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)", // Subtle shadow
          '&:hover': {
            backgroundColor: '#ff3366', // Darker shade for hover
          },
          '&:active': {
            boxShadow: "none", // Remove shadow on active
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: '#1a1a1a', // Match paper background
            color: '#e0e0e0',
          },
          '& .MuiInputLabel-root': {
            color: '#ffcc00', // Yellow for labels
          },
          '& .MuiInput-underline:before': {
            borderBottomColor: '#ff0055', // Pink underline
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: '#ff3366', // Darker pink on hover
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#00ffff', // Cyan underline on focus
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          'input:-webkit-autofill': {
            '-webkit-box-shadow': '0 0 0 30px #1a1a1a inset !important', // Match the non-autofilled background color
            '-webkit-text-fill-color': '#e0e0e0 !important', // Match the text color
            transition: 'background-color 5000s ease-in-out 0s !important', // Prevents the background color from changing
          },
          'input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active': {
            '-webkit-box-shadow': '0 0 0 30px #1a1a1a inset !important', // Ensure consistency across states
            '-webkit-text-fill-color': '#e0e0e0 !important',
          },
        },
      },
    },
  },
});

export default cyberpunkTheme;
