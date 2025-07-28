const ChallengePreview = () => (
  <div className="card bg-base-200/50 shadow-lg border border-base-300 text-left">
    <div className="card-body">
      <h3 className="font-semibold text-base-content/70">Featured Challenge</h3>
      <p className="text-xl font-bold">Build a Real-time Chat App</p>
      <p className="text-sm text-base-content/60">
        Using React, TypeScript, and Socket.IO. The app should handle multiple
        rooms and user authentication.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="badge badge-outline">React</div>
        <div className="badge badge-outline">TypeScript</div>
        <div className="badge badge-outline">Sockets</div>
      </div>
      <div className="card-actions justify-between items-center mt-6">
        <span className="text-2xl font-bold text-primary">$2,500 Prize</span>
        <button className="btn btn-outline btn-primary btn-sm">
          View Details
        </button>
      </div>
    </div>
  </div>
);

export default ChallengePreview;
