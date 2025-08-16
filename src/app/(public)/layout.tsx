import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";

interface Props {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: Props) => {
  return (
    <div className="grid min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
