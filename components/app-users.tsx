"use client";

import React, { useEffect, useState, useTransition } from "react";
import AppCard from "./app-card";

type userType = { createdAt: string; name: string; avatar: string; username: string; id: 1 };

const AppUsers = () => {
      const [users, setUsers] = useState<userType[]>([]);
      const [loading, startTransition] = useTransition();

      const getData = async () => {
            const res = await fetch("https://674c4a4454e1fca9290c1f5f.mockapi.io/users", {
                  method: "GET",
            });
            setUsers(await res.json());
      };

      useEffect(() => {
            startTransition(getData);
      }, []);

      if (loading && users.length === 0) return <p>loading...</p>;
      if (!loading && users.length === 0) return <p>no users</p>;

      return users.map((item) => <AppCard text={item.name} />);
};

export default AppUsers;
