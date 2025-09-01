import { useContext, useEffect, useState } from "react";
import "./App.css";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
import { useNavigate } from "react-router";

function App() {
  const [authReady, setAuthReady] = useState(false);
  const { token, tokenData, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      localStorage.setItem("user", JSON.stringify(tokenData));
      localStorage.setItem("userId", tokenData?.sub);
      localStorage.setItem("token", token);
      setAuthReady(true);
      setTimeout(() => {
        navigate("/activities");
      },500); 
    }
    
  }, [token, tokenData, dispatch]);

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#e3f2fd"
      padding={2}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 3,
          maxWidth: 400,
          width: "100%",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Fitness Tracker Login
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ marginBottom: 3, color: "#555" }}
        >
          Track your fitness journey with ease.
        </Typography>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
        >
          {/* <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          /> */}
          {/* <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{
              padding: 1.5,
              fontWeight: "bold",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Login
          </Button> */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => login()}
            sx={{
              padding: 1.5,
              fontWeight: "bold",
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                borderColor: "#1565c0",
                color: "#1565c0",
              },
            }}
          >
            Login with OAuth
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default App;