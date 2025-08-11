// ===== File: src/app/(public)/about/page.tsx =====
import PageTitle from "@/components/Common/PageTitle";
import TeamMemberCard from "@/components/Common/TeamCard";
import Link from "next/link";
import { FiTarget, FiUsers } from "react-icons/fi";

const teamMembers = [
  {
    name: "Anas Obaid",
    title: "Founder & CEO",
    bio: "Driving the mission to revolutionize technical hiring with a background in full-stack development and product strategy.",
    imageUrl: "/team/founder.png",
    socials: {
      linkedin: "https://linkedin.com/in/theanasobaid/",
      github: "https://github.com/TheAnasObaid",
    },
  },
  {
    name: "Syed Muhammad Muslim",
    title: "Technical & Strategic Project Director",
    bio: "A seasoned strategist ensuring SkillSync aligns with market needs, delivering maximum value and impact for our clients.",
    imageUrl: "/team/director.png",
    socials: {
      linkedin: "https://www.linkedin.com/in/syedmuhammadmuslim/",
      github: "http://github.com/syedmuhammadmuslim",
    },
  },
  {
    name: "Mahrukh Tahir",
    title: "Co-Founder & CMO",
    bio: "The growth engine behind SkillSync, Mahrukh builds our community and connects our platform with innovative companies worldwide.",
    imageUrl: "/team/co-founder-cmo.png",
    socials: {
      // linkedin: "https://linkedin.com/in/...",
      github: "https://github.com/Maha0298",
    },
  },
  {
    name: "Faizan Ali",
    title: "Co-Founder",
    bio: "With a keen eye for user-centric design, Faizan crafts the clean, responsive, and engaging interface that makes SkillSync a joy to use.",
    imageUrl: "/team/co.png",
    socials: {
      linkedin: "https://www.linkedin.com/in/m-faizan-ali-webdeveloper",
      github: "https://github.com/M-faizan-ali",
    },
  },
];

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 md:py-20 px-4 space-y-24">
      <PageTitle
        icon={<FiTarget />}
        title="Our Mission"
        subtitle="To build a world where technical hiring is based on proven skill, not resumes. We connect innovative companies with exceptional developers through objective, real-world challenges."
      />

      <section>
        <div className="text-center mb-12">
          <FiUsers className="mx-auto text-5xl text-primary mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            The Leadership Team
          </h2>
          <p className="mt-4 text-lg text-base-content/80 max-w-2xl mx-auto">
            We are a passionate team of developers and strategists dedicated to
            fixing the broken technical hiring process.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      <section className="text-center bg-base-200/50 border border-base-300 rounded-lg p-10">
        <h2 className="text-3xl font-bold">Join Our Mission</h2>
        <p className="mt-4 max-w-xl mx-auto text-base-content/70">
          Whether you're a business looking to hire the best talent or a
          developer ready to prove your skills, SkillSync is your platform.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/pricing" className="btn btn-primary">
            For Businesses
          </Link>
          <Link href="/challenges" className="btn btn-ghost">
            For Developers
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
