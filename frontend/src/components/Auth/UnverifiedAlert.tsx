import { FiAlertTriangle } from "react-icons/fi";

interface Props {
  error: string;
  onResend: () => void;
  isResending: boolean;
}

const UnverifiedUserAlert = ({ error, onResend, isResending }: Props) => (
  <div className="alert alert-warning alert-soft">
    <FiAlertTriangle />
    <div>
      <h3 className="font-bold">Account Not Verified</h3>
      <div className="text-xs">{error}</div>
      <div className="mt-2">
        <button
          type="button"
          className="btn btn-sm btn-warning"
          onClick={onResend}
          disabled={isResending}
        >
          {isResending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Resend Verification Email"
          )}
        </button>
      </div>
    </div>
  </div>
);

export default UnverifiedUserAlert;
