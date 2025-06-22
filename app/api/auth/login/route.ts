// import { User } from '@/types/model.types';
// import {
//       internalServerError,
//       inValidCredentionalsResponse,
//       notFoundResponse,
//       notValidDataResponse,
//       successResponse,
// } from '@/utils/api/response';
// import { cookies } from 'next/headers';

// export type LoginBody = Omit<User, 'created_at' | 'username' | 'id' | 'role'>;

// const userData: Omit<User, 'created_at' | 'id' | 'role'>[] = [
//       {
//             email: 'test@gmail.com',
//             password: 'mohammadk13',
//             username: 'mohammadk13',
//       },
//       {
//             email: 'test2@gmail.com',
//             password: 'mohammadk12',
//             username: 'mohammadk12',
//       },
// ];

// export async function POST(req: Request) {
//       try {
//             // get user data -> username, password
//             const body = (await req.json()) as LoginBody;
//             const { password, email } = body;

//             // validtion user data
//             if (!password || !email) {
//                   return inValidCredentionalsResponse();
//             }

//             // find if user exist
//             const wantedUser = userData.find((user) => user.email === email);

//             // check user is exist
//             if (!wantedUser) {
//                   // no -> send 404 response
//                   return notFoundResponse('User');
//             }

//             // yes -> check password is currect
//             const passwordMatch = wantedUser?.password === password;
//             if (passwordMatch) {
//                   // yes -> create session and store in cookie & send 200 response
//                   const sessionToken = JSON.stringify({ email, password });
//                   (await cookies()).set('token', sessionToken);

//                   return successResponse(`Welcome ${wantedUser.username}`);
//             } else {
//                   // no -> send invalid username & password
//                   return notValidDataResponse('Email or password');
//             }
//       } catch (err) {
//             console.log('Login route -- err', err);
//             return internalServerError();
//       }
// }
