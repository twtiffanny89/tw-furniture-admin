interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRoles: string[]; // Accept an array of roles
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  // If authenticated and authorized, render the children (protected page content)
  return <>{children}</>;
};

export default AuthWrapper;
