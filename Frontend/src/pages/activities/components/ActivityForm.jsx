import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { API_AGENT } from "../../../network/api";
import ActivityList from "./ActivityList";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "react-oauth2-code-pkce";

function ActivityForm() {
  const activityListRef = useRef();
    const { logOut} = useContext(AuthContext);


  const [loading, setLoading] = useState(false);
  const [activityForm, setActivityForm] = useState({
    activityType: "",
    duration: "",
    caloriesBurned: "",
  });
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

  const refreshActivities = () => {
    if (activityListRef.current) {
      activityListRef.current.getActivities();
    }
  };

  const handleAddActivity = (e) => {
    e?.preventDefault();
    setLoading(true);
    setApiError(null); // Clear any previous errors
    API_AGENT.Activities.createActivity({
      type: activityForm?.activityType,
      duration: Number(activityForm?.duration),
      caloriesBurned: Number(activityForm?.caloriesBurned),
    })
      .then((res) => {
        console.log("Response:", res);
        setActivityForm({ activityType: "", duration: "", caloriesBurned: "" });
        if (res?.status === 200 || res?.status === 201) {
          setApiSuccess("Activity added successfully!");
          refreshActivities();
        }
      })
      .catch((err) => {
        console.error("Error adding activity:", err);
        setApiError(err?.message || "An unexpected error occurred.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnChange = (e) => {
    setActivityForm({
      ...activityForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    logOut();
    window.location.href = "/"; // Adjust the path as per your routing setup
  };

  return (
    <Box
      display="flex"
      flexDirection={"row"}
      minHeight="100vh"
      bgcolor="#e0f7fa"
      padding={2}
      gap={2}
      position="relative"
      paddingTop={10}
    >
      {/* Logout Icon */}
      <Tooltip title="Logout">
        <IconButton
          onClick={handleLogout}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "#ffffff",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <LogoutIcon sx={{ color: "#00796b" }} />
        </IconButton>
      </Tooltip>

      <Box display={"flex"} flexDirection={"column"} width={"30%"}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            height: "fit-content",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", color: "#00796b" }}
            paddingBottom={2}
          >
            Add Activity
          </Typography>

          {/* Display API error if it exists */}
          {apiError && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {apiError}
            </Alert>
          )}

          {apiSuccess && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              {apiSuccess}
            </Alert>
          )}

          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              select
              label="Activity Type"
              name="activityType"
              value={activityForm?.activityType}
              onChange={(e) => handleOnChange(e)}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="RUNNING">Running</MenuItem>
              <MenuItem value="WALKING">Walking</MenuItem>
              <MenuItem value="CYCLING">Cycling</MenuItem>
            </TextField>
            <TextField
              label="Duration (Minutes)"
              type="number"
              name="duration"
              value={activityForm?.duration}
              onChange={(e) => handleOnChange(e)}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Calories Burned"
              type="number"
              name="caloriesBurned"
              value={activityForm?.caloriesBurned}
              onChange={(e) => handleOnChange(e)}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              onClick={handleAddActivity}
              sx={{
                padding: 1.5,
                fontWeight: "bold",
                backgroundColor: "#00796b",
                "&:hover": {
                  backgroundColor: "#004d40",
                },
              }}
            >
              {loading ? "Adding..." : "Add Activity"}
            </Button>
          </Box>
        </Paper>
        <Card
          elevation={3}
          sx={{
            marginTop: 3,
            padding: 2,
            borderRadius: 3,
            backgroundColor: "#f5f5f5",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              align="center"
              sx={{ fontWeight: "bold", color: "#00796b" }}
            >
              AI-Generated Platform
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ marginTop: 1, color: "#555" }}
            >
              This platform uses AI to generate recommendations. Please note
              that it might take some time to process and provide accurate
              suggestions.
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <ActivityList ref={activityListRef} />
    </Box>
  );
}

export default ActivityForm;