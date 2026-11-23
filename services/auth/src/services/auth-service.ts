export type PublicUser = {
  id: string;
  email: string;
};

export type NewUser = {
  email: string;
  passwordHash: string;
};

export type UserRepository = {
  findByEmail(email: string): Promise<PublicUser | null>;
  create(user: NewUser): Promise<PublicUser>;
};

export type RegisterUserDependencies = {
  users: UserRepository;
  hashPassword(password: string): Promise<string>;
};

export async function registerUser(
  input: { email: string; password: string },
  dependencies: RegisterUserDependencies,
): Promise<PublicUser> {
  const email = input.email.trim().toLowerCase();
  const existingUser = await dependencies.users.findByEmail(email);

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await dependencies.hashPassword(input.password);

  return dependencies.users.create({ email, passwordHash });
}
