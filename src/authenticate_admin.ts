const DEFAULT_ADMIN = {
  email: process.env.PROJECT8_ADMIN_EMAIL,
  password: process.env.PROJECT8_ADMIN_PASSWORD,
};

export const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};
