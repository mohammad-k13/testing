import { LoginBody, POST } from '@/app/api/auth/login/route';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';

vi.mock("next/headers", () => ({
      cookies: vi.fn(() => ({
            set: vi.fn()
      }))
}))

describe('Login End Point', () => {
      const url = 'http://localhost:3000/api/auth/login';

      const getResponse = async (init?: RequestInit) => {
            const mockedRequest = new Request(url, init);
            const response = await POST(mockedRequest);

            const data = await response.json();

            return {
                  data,
                  response,
            };
      };

      it('Should return response with status of 500 when body not provided', async () => {
            const init: RequestInit = {
                  method: 'POST',
            };

            const { data, response } = await getResponse(init);

            expect(response.status).toBe(500);
            expect(data).toHaveProperty('message');
            expect(data.message).toBe('Internal Server Error');
      });

      it('Should return currect response when email or password is mising', async () => {
            const body: LoginBody = {
                  email: '',
                  password: '',
            };
            const init: RequestInit = {
                  method: 'POST',
                  body: JSON.stringify(body),
            };

            const { data, response } = await getResponse(init);

            expect(response?.status).toBe(401);
            expect(data).toHaveProperty('message');
            expect(data.message).toBe('Invalid credentionals');
      });

      it('Should return currect response when user not found', async () => {
            const body: LoginBody = {
                  email: 'sadfsafasf',
                  password: 'asdfasdfasdfsad',
            };
            const init: RequestInit = {
                  method: 'POST',
                  body: JSON.stringify(body),
            };

            const { data, response } = await getResponse(init);

            expect(response?.status).toBe(404);
            expect(data).toHaveProperty('message');
            expect(data.message).toBe('User not found!');
      });

      it('Should return currect response when password is not currect', async () => {
            const body: LoginBody = {
                  email: 'test@gmail.com',
                  password: '2342342342',
            };
            const init: RequestInit = {
                  method: 'POST',
                  body: JSON.stringify(body),
            };

            const { data, response } = await getResponse(init);

            expect(response?.status).toBe(401);
            expect(data).toHaveProperty('message');
            expect(data.message).toBe("Email or password isn't valid");
      });

      it('Should return currect response when email and password is currect', async () => {
            const body: LoginBody = {
                  email: 'test@gmail.com',
                  password: 'mohammadk13',
            };
            const init: RequestInit = {
                  method: 'POST',
                  body: JSON.stringify(body),
            };

            const { data, response } = await getResponse(init);

            expect(response?.status).toBe(200);
            expect(data).toHaveProperty('message');
            expect(data.message).toContain("Welcome");
      });
});
