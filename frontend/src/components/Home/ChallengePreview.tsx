import Link from "next/link";
import { FiArrowRight, FiStar } from "react-icons/fi";

const ChallengePreview = () => (
  // The entire card is a link for better UX, with our consistent hover effect + a subtle lift
  <Link
    href="/challenges"
    className="card bg-base-200/50 shadow-lg border border-base-300 text-left transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20 hover:-translate-y-1 group"
  >
    <div className="card-body">
      {/* A more professional "Featured" badge */}
      <div className="flex items-center gap-2">
        <FiStar className="text-primary" />
        <h3 className="font-semibold text-primary">Featured Challenge</h3>
      </div>

      <p className="text-xl font-bold mt-2">Build a Real-time Chat App</p>
      <p className="text-sm text-base-content/60 mt-1">
        Using React, TypeScript, and Socket.IO. The app should handle multiple
        rooms and user authentication.
      </p>

      {/* Using the consistent mono font for tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="badge badge-outline font-mono text-xs">React</div>
        <div className="badge badge-outline font-mono text-xs">TypeScript</div>
        <div className="badge badge-outline font-mono text-xs">Sockets</div>
      </div>

      {/* Divider for better separation */}
      <div className="divider my-3"></div>

      <div className="card-actions justify-between items-center">
        <span className="text-3xl font-bold text-primary">$2,500</span>
        {/* The button now feels more like a part of the card, with a clear icon cue */}
        <div className="flex items-center gap-2 text-base-content/70 transition-colors group-hover:text-primary">
          View Challenges <FiArrowRight />
        </div>
      </div>
    </div>
  </Link>
);

export default ChallengePreview;
