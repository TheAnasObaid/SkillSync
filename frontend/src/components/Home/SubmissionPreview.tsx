import { FiAward, FiFilePlus, FiGitBranch } from "react-icons/fi";

// A list of plausible, interesting events to display in the feed.
const events = [
  {
    icon: FiGitBranch,
    color: "text-info",
    title: "New Submission Received",
    description: "from 'anna.dev' for Web Analytics Dashboard",
    time: "Just now",
  },
  {
    icon: FiFilePlus,
    color: "text-success",
    title: "New Challenge Posted",
    description: "by 'Innovate Inc.' - API Integration",
    time: "2m ago",
  },
  {
    icon: FiAward,
    color: "text-primary",
    title: "Winner Selected!",
    description: "'chris_g' for Real-time Chat App",
    time: "1h ago",
  },
  {
    icon: FiGitBranch,
    color: "text-info",
    title: "New Submission Received",
    description: "from 'maria' for Mobile UI Kit",
    time: "4h ago",
  },
];

const SubmissionPreview = () => (
  // The 'group' class is essential for the hover-to-pause effect
  <div className="mockup-window card bg-base-200/50 shadow-lg border border-base-300 text-left group">
    <div className="card-body">
      <h3 className="font-semibold text-base-content/70">Live Platform Feed</h3>

      {/* This container acts as the viewport for the animation */}
      <div className="relative mt-4 h-48 overflow-hidden">
        {/* The inner div contains two copies of the list for a seamless loop */}
        <div className="absolute top-0 left-0 w-full animate-[scroll-vertical_20s_linear_infinite] group-hover:[animation-play-state:paused]">
          {/* List #1 */}
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div
                  className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-base-300/70 ${event.color}`}
                >
                  <event.icon className="h-4 w-4" />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-sm">{event.title}</p>
                  <p className="text-xs text-base-content/60">
                    {event.description}
                  </p>
                </div>
                <p className="text-xs text-base-content/50 flex-shrink-0">
                  {event.time}
                </p>
              </div>
            ))}
          </div>

          {/* List #2 (a duplicate for the seamless loop effect) */}
          <div className="space-y-4 mt-4" aria-hidden="true">
            {events.map((event, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div
                  className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-base-300/70 ${event.color}`}
                >
                  <event.icon className="h-4 w-4" />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-sm">{event.title}</p>
                  <p className="text-xs text-base-content/60">
                    {event.description}
                  </p>
                </div>
                <p className="text-xs text-base-content/50 flex-shrink-0">
                  {event.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SubmissionPreview;
