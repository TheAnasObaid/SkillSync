interface AuthCardHeaderProps {
  title: string;
  subtitle: string;
}

const AuthCardHeader = ({ title, subtitle }: AuthCardHeaderProps) => (
  <div className="text-center mb-6">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-base-content/70 mt-2">{subtitle}</p>
  </div>
);

export default AuthCardHeader;
