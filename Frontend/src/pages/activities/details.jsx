import React, { useEffect, useState } from "react";
import { API_AGENT } from "../../network/api";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ActivityDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the activity ID from the URL
  const [activity, setActivityDetails] = useState(null); // State to store activity details
  const [activityMetaData, setActivityMetaData] = useState(null); // State to store activity details
  const [recommendation, setRecommendation] = useState(null); // State to store recommendations
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  const fetchActivityDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      await API_AGENT.Activities.getActivityRecommendations(id).then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setActivityDetails(res?.data);
          setRecommendation(res?.data?.recommendation);
        }
      });

      await API_AGENT.Activities.getActivity(id).then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setActivityMetaData(res?.data);
        }
      });
    } catch (err) {
      console.error("Error fetching activity details:", err);
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  console.log("activityMetaData", activityMetaData);

  useEffect(() => {
    fetchActivityDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="#f0f4f8"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="#f0f4f8"
      >
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f0f4f8" }}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: "absolute",
          top: 23,
          left: 16,
          backgroundColor: "#ffffff",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
        <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Activity Details
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">
              <strong>Type:</strong> {activityMetaData.type}
            </Typography>
            <Typography variant="h6">
              <strong>Duration:</strong> {activityMetaData.duration} minutes
            </Typography>
            <Typography variant="h6">
              <strong>Calories Burned:</strong>{" "}
              {activityMetaData.caloriesBurned}
            </Typography>
            <Typography variant="h6">
              <strong>Date:</strong>{" "}
              {new Date(activityMetaData.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Paper>

        {recommendation && (
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              AI Recommendation
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="h6">
                <strong>Analysis:</strong>
              </Typography>
              <Typography paragraph>{activity.recommendation}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">
                <strong>Improvements:</strong>
              </Typography>
              {activity?.improvements?.length > 0 ? (
                activity.improvements.map((improvement, index) => (
                  <Typography key={index} paragraph>
                    • {improvement}
                  </Typography>
                ))
              ) : (
                <Typography paragraph>No improvements suggested.</Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">
                <strong>Suggestions:</strong>
              </Typography>
              {activity?.suggestions?.length > 0 ? (
                activity.suggestions.map((suggestion, index) => (
                  <Typography key={index} paragraph>
                    • {suggestion}
                  </Typography>
                ))
              ) : (
                <Typography paragraph>No suggestions available.</Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">
                <strong>Safety Guidelines:</strong>
              </Typography>
              {activity?.safety?.length > 0 ? (
                activity.safety.map((safety, index) => (
                  <Typography key={index} paragraph>
                    • {safety}
                  </Typography>
                ))
              ) : (
                <Typography paragraph>
                  No safety guidelines provided.
                </Typography>
              )}
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default ActivityDetails;
