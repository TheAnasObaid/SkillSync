import { FiCheckCircle } from "react-icons/fi";

const SuccessAlert = () => (
  <div className="alert alert-success">
    <FiCheckCircle />
    <div>
      <h3 className="font-bold">Registration Successful!</h3>
      <div className="text-xs">You can now sign in to your new account.</div>
    </div>
  </div>
);

export default SuccessAlert;
