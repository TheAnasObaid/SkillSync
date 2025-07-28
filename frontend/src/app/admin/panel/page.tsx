import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Container from "@/components/Layout/Container";
import { FiUsers, FiClipboard } from "react-icons/fi";

const AdminPanelPage = () => {
  return (
    <Container>
      <div className="py-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body gap-4">
            <h1 className="card-title text-3xl font-bold">Admin Panel</h1>
            <p className="text-base-content/70">
              Review submissions and manage users here.
            </p>
            <div className="divider">Actions</div>
            <div className="card-actions justify-start">
              <button className="btn btn-primary">
                <FiClipboard /> View Submissions
              </button>
              <button className="btn btn-secondary">
                <FiUsers /> Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AdminPanelPage;
