"use client";
import useAuth from "@/hooks/useAuth";
import React from "react";

const Dashboard = () => {
      const { isAuthenticated, user, loading } = useAuth();

      if (loading) {
            return <div data-testid="dashboard-loading">Loading dashboard...</div>;
      }

      if (!isAuthenticated) {
            return <div data-testid="dashboard-guest">Please log in to view the dashboard</div>;
      }

      return (
            <div data-testid="dashboard-content">
                  <h1>Welcome, {user?.name}</h1>
                  <p>This is your personalized dashboard content.</p>
            </div>
      );
};

export default Dashboard;
