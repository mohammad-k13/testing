"use client";

import React, { useEffect, useState, useTransition } from "react";
import AppCard from "./app-card";
import { getUsers, IUser } from "@/services/users";

const AppUsers = () => {
      const [users, setUsers] = useState<IUser[]>([]);
      const [loading, startTransition] = useTransition();

      useEffect(() => {
            startTransition(async () => {
                  // await getUsers();
                  const usersList = await getUsers();
                  setUsers(usersList);
            });
      }, []);

      if (loading && users.length === 0) return <div data-testid="loading-state">Loading users...</div>;
      if (!loading && users.length === 0) return <div data-testid="empty-state">No users found.</div>;

      return (
            <div data-testid="user-list" className="w-screen h-screen flex items-center justify-center gap-5">
                  <h1>User List</h1>
                  {users.map((user) => (
                        <AppCard key={user.id} text={user.name} />
                  ))}
            </div>
      );
};

export default AppUsers;
