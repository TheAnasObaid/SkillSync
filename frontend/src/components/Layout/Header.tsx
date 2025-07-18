import Container from "./Container";
import Navbar from "../Navbar";

const Header = () => {
  return (
    <header className="bg-blue-50">
      <Container>
        <Navbar />
      </Container>
    </header>
  );
};

export default Header;
