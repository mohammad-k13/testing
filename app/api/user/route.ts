import { User } from '@/types/model.types';
import { createClient } from '@/utils/supabase/server';

export type CreateUserModel = Omit<User, 'created_at' | 'id'>;
export async function POST(req: Request) {
      const body = (await req.json()) as CreateUserModel;
      const supabase = await createClient();

      const { email, password, role, username } = body;

      if (!email || !password || !role || !username) {
            return new Response(JSON.stringify({ message: 'Invalid credentionals' }), { status: 401 });
      }

      const { error, status, statusText } = await supabase.from('users').insert({ email, password, username, role });

      if (error) {
            return new Response(JSON.stringify({ message: error.message }), { status, statusText });
      }

      return new Response(JSON.stringify({ message: 'User created successfully!' }), { status, statusText });
}
