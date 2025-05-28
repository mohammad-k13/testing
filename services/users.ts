export interface IUser {
      createdAt: string;
      name: string;
      avatar: string;
      username: string;
      id: string;
}

export async function getUsers(): Promise<IUser[]> {
      try {
            const res = await fetch("https://674c4a4454e1fca9290c1f5f.mockapi.io/users");
            const users = await res.json();
            return users;
      } catch (err) {
            console.log("getUser -- err", err);
            return [];
      }
}
