import React from "react";
import { Box, H2, Text, Illustration } from "@adminjs/design-system";

const Dashboard = (props) => {
  const { currentAdmin } = props;

  // Render a specific view strictly for the Admin
  if (currentAdmin && currentAdmin.role === "admin") {
    return (
      <Box variant="grey">
        <Box variant="white" padding="xl" style={{ margin: '20px', borderRadius: '8px' }}>
          <H2>Admin System Summary</H2>
          <Text mb="lg">Welcome to the Control Center. Here is your platform data.</Text>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <Box style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
              <H2 style={{ marginBottom: '10px' }}>Users</H2>
              <Text>Active Platform Users</Text>
            </Box>
            <Box style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
              <H2 style={{ marginBottom: '10px' }}>Orders</H2>
              <Text>System Analytics & Fulfillments</Text>
            </Box>
            <Box style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
              <H2 style={{ marginBottom: '10px' }}>Revenue</H2>
              <Text>Total Global Revenue Tracker</Text>
            </Box>
          </div>
        </Box>
      </Box>
    );
  }

  // Render the limited personal space for standard Users
  return (
    <Box variant="grey">
      <Box variant="white" padding="xl" style={{ margin: '20px', borderRadius: '8px', textAlign: 'center' }}>
        <Illustration variant="Astronaut" style={{ height: '150px', marginBottom: '20px' }} />
        <H2>Welcome, {currentAdmin?.email}!</H2>
        <Text>This is your limited personal dashboard.</Text>
        <Text mt="md">You do not have access to view Global Settings, modify System Data, or browse other user metrics.</Text>
      </Box>
    </Box>
  );
};

export default Dashboard;
