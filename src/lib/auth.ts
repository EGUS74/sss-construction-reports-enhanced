// 🔒 Fake user role for demo purposes

export async function getUserRole(uid: string): Promise<'admin' | 'foreman' | null> {
    return 'admin'; // or 'foreman'
  }
  