import { FiCheckCircle, FiClock } from "react-icons/fi";

const SubmissionPreview = () => (
  <div className="card bg-base-200/50 shadow-lg border border-base-300 text-left">
    <div className="card-body">
      <h3 className="font-semibold text-base-content/70">
        Incoming Submissions
      </h3>
      <div className="tabs tabs-bordered mt-2">
        <a className="tab tab-bordered tab-active">Pending (2)</a>
        <a className="tab tab-bordered">Reviewed (5)</a>
      </div>
      <div className="space-y-3 mt-4">
        <div className="p-3 bg-primary/10 border border-primary/50 rounded-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="text-primary text-xl" />
            <div>
              <p className="font-bold">Bob Smith</p>
              <span className="font-mono text-sm text-primary">
                bob-smith-submission
              </span>
            </div>
          </div>
          <span className="badge badge-success badge-sm font-bold">Winner</span>
        </div>
        <div className="p-3 bg-base-300/50 rounded-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiClock className="text-warning text-xl" />
            <div>
              <p className="font-bold">John Smith</p>
              <span className="font-mono text-sm text-base-content/60">
                john-smith-final
              </span>
            </div>
          </div>
          <span className="badge badge-ghost badge-sm">...</span>
        </div>
      </div>
    </div>
  </div>
);

export default SubmissionPreview;
