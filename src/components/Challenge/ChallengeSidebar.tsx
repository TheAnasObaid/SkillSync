"use client";

import { useAuthStore } from "@/store/authStore";
import { Challenge } from "@prisma/client";
import { useEffect, useState } from "react";
import { FiAward, FiDownload, FiHash } from "react-icons/fi";
import CtaBlock from "./CtaBlock";

// 1. Define the specific structure of the file objects we store in the JSON field.
interface ChallengeFile {
  name: string;
  path: string;
}

interface ChallengeSidebarProps {
  challenge: Challenge;
  onOpenModal: () => void;
}

const ChallengeSidebar = ({
  challenge,
  onOpenModal,
}: ChallengeSidebarProps) => {
  const { user } = useAuthStore();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // We are not using an external API base URL anymore for local files.
  // The path `/uploads/...` will work directly.

  return (
    <aside className="space-y-6 lg:sticky top-24 h-fit">
      {/* --- CONSOLIDATED INFO CARD --- */}
      <div className="card bg-base-200/50 border border-base-300">
        <div className="card-body p-4 space-y-3">
          <div className="flex items-center gap-3">
            <FiAward className="text-primary text-xl flex-shrink-0" />
            <div>
              <p className="text-xs text-base-content/70">Prize</p>
              <p className="font-bold text-primary text-lg">
                ${challenge.prize.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiHash className="text-base-content/70 text-xl flex-shrink-0 mt-1" />
            <div className="flex flex-wrap items-center gap-2">
              {challenge.tags.map((tag) => (
                <div key={tag} className="badge badge-neutral badge-soft">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- RESOURCES CARD --- */}
      {challenge.files && challenge.files.length > 0 && (
        <div className="card bg-base-200/50 border border-base-300">
          <div className="card-body p-4">
            <h3 className="card-title text-base">Resources</h3>
            <div className="space-y-2">
              {/* 2. Use a type assertion to tell TypeScript the shape of each `file`. */}
              {(challenge.files as unknown as ChallengeFile[]).map(
                (file, i) => (
                  <a
                    key={i}
                    // 3. The path is now relative from the /public directory.
                    href={file.path}
                    download={file.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm btn-block"
                  >
                    <FiDownload /> {file.name}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- CTA BLOCK --- */}
      {hasMounted ? (
        <CtaBlock role={user?.role || null} onOpenModal={onOpenModal} />
      ) : (
        <div className="skeleton h-24 w-full"></div>
      )}
    </aside>
  );
};

export default ChallengeSidebar;
