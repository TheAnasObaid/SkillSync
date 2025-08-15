"use client";

import Image from "next/image";
import Link from "next/link";
import { FiLinkedin, FiGithub, FiTwitter } from "react-icons/fi";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  socials?: {
    linkedin?: string;
    github?: string;
  };
}

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className="card bg-base-200/50 border border-base-300 text-center items-center p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="avatar">
        <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
          <Image
            src={member.imageUrl}
            alt={`Headshot of ${member.name}`}
            width={128}
            height={128}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="card-body p-4 items-center">
        <h3 className="card-title text-2xl font-bold">{member.name}</h3>
        <p className="text-primary font-semibold">{member.title}</p>
        <p className="text-base-content/70 mt-2 text-sm">{member.bio}</p>

        {member.socials && (
          <div className="card-actions justify-center mt-4">
            {member.socials.linkedin && (
              <Link
                href={member.socials.linkedin}
                target="_blank"
                className="btn btn-ghost btn-circle"
              >
                <FiLinkedin />
              </Link>
            )}
            {member.socials.github && (
              <Link
                href={member.socials.github}
                target="_blank"
                className="btn btn-ghost btn-circle"
              >
                <FiGithub />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
