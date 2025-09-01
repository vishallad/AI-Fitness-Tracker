import { Box, Button, Paper, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Icon for duration
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"; // Icon for calories burned


function ActivityCard({ data }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/activities/${data?.id}`);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "WALKING":
        return <DirectionsWalkIcon sx={{ color: "#00796b", marginRight: 1 }} />;
      case "RUNNING":
        return <DirectionsRunIcon sx={{ color: "#00796b", marginRight: 1 }} />;
      case "CYCLING":
        return <PedalBikeIcon sx={{ color: "#00796b", marginRight: 1 }} />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        borderRadius: 3,
        height: "fit-content",
      }}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <div>
          <Box display="flex" alignItems="center" gap={0} paddingBottom={2}>
            {getActivityIcon(data?.type)}
            <Typography
              variant="h5"
              gutterBottom
              align="left"
              sx={{ fontWeight: "bold", color: "#00796b" }}
              marginBottom={0}
            >
              {data?.type}
            </Typography>
          </Box>
          <Box display={"flex"} alignItems="center" gap={1}>
            <AccessTimeIcon sx={{ color: "#00796b" }} />
            <Typography
              variant="h6"
              gutterBottom
              align="left"
              sx={{ fontWeight: "bold", color: "#00796b" }}
              marginBottom={0}
            >
              Duration:
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              align="left"
              sx={{ fontWeight: "bold", color: "#00796b" }}
              marginBottom={0}
            >
              {data?.duration ? `${data?.duration} mins` : "0 mins"}
            </Typography>
          </Box>
          <Box display={"flex"} alignItems="center" gap={1}>
            <LocalFireDepartmentIcon sx={{ color: "#00796b" }} />
            <Typography
              variant="h6"
              gutterBottom
              align="left"
              sx={{ fontWeight: "bold", color: "#00796b" }}
              marginBottom={0}
            >
              Calories Burned:
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              align="left"
              sx={{ fontWeight: "bold", color: "#00796b" }}
              marginBottom={0}
            >
              {data?.caloriesBurned ? `${data?.caloriesBurned} K cal` : "0"}
            </Typography>
          </Box>
        </div>
        <Button
          variant="contained"
          color="primary"
          sx={{
            padding: 1.5,
            fontWeight: "bold",
            backgroundColor: "#00796b",
            "&:hover": {
              backgroundColor: "#004d40",
            },
          }}
          onClick={handleViewDetails}
        >
          View Recommendation
        </Button>
      </Box>
    </Paper>
  );
}

export default ActivityCard;
