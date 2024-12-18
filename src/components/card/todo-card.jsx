import React from "react";
import { Box, Card, CardContent, Typography, Chip, IconButton, Button, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Delete, Edit, Archive } from "@mui/icons-material";

// Utility to generate a random background color
const getRandomBackgroundColor = () => {
  const colors = ["#FFCDD2", "#C8E6C9", "#BBDEFB", "#FFE082", "#D1C4E9", "#FFAB91", "#B3E5FC"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const TodoCard = ({ todo, onEdit, onDelete }) => {
  const { title, description, status, priority, startDate, endDate, star, isActive } = todo;

  const PriorityChip = ({ priority }) => {
    const colors = ["success", "warning", "error", "error", "error", "error"];
    const labels = ["Low", "Medium", "High", "Urgent", "Critical", "Immediate"];

    return <Chip label={labels[priority]} color={colors[priority]} size="small" />;
  };

  const colorRef = React.useRef(getRandomBackgroundColor());
  const StatusChip = ({ status }) => {
    return <Chip label={status} color={"primary"} size="small" />;
  };
  return (
    <Card
      sx={{
        backgroundColor: colorRef.current,
        color: "black",
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      <CardContent>
        {/* Title and Star Icon */}
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={1}>
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
          <IconButton>{star ? <StarIcon color="primary" /> : <StarBorderIcon />}</IconButton>
        </Box>

        {/* Description */}
        <Typography
          sx={{
            lineClamp: 1,
          }}
          variant="body2"
          color="text.secondary"
          marginBottom={2}
        >
          {description}
        </Typography>

        {/* Status and Priority */}
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={1}>
          <Chip label={isActive ? "Active" : "Inactive"} color={isActive ? "success" : "default"} size="small" />
          <Stack direction="row" gap={1}>
            <PriorityChip priority={priority} />
            <StatusChip status={status} />
          </Stack>
        </Box>

        {/* Dates */}
        <Typography variant="caption" display="block">
          Start: {new Date(startDate).toLocaleDateString()}
        </Typography>
        <Typography variant="caption" display="block" marginBottom={2}>
          Due: {new Date(endDate).toLocaleDateString()}
        </Typography>

        {/* Footer: Edit and Delete Buttons */}
        <Box gap={2} display="flex" alignItems="center">
          <Button variant="contained" startIcon={<Edit />} onClick={() => onEdit(todo)} size="small">
            Edit
          </Button>
          <Button variant="contained" color="error" startIcon={<Delete />} onClick={() => onDelete(todo.id)} size="small">
            Delete
          </Button>
          <IconButton onClick={() => onDelete(todo.id)} size="small">
            <Archive color="inherit" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

// Example Usage
