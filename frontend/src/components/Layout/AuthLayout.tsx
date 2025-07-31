const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid bg-base-100 max-w-7xl mx-auto w-full">{children}</div>
  );
};

export default AuthLayout;
