import PageTitle from "@/components/Common/PageTitle";
import { FiShield } from "react-icons/fi";

const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="grid md:grid-cols-3 gap-4 md:gap-8 pb-8 border-b border-base-300">
    <div className="md:col-span-1">
      <h2 className="text-xl font-bold sticky top-24">{title}</h2>
    </div>
    <div className="md:col-span-2 prose prose-lg max-w-none text-base-content/80">
      {children}
    </div>
  </div>
);

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <PageTitle
        icon={<FiShield />}
        title="Privacy at SkillSync"
        subtitle="We are committed to transparency and protecting your data. This policy explains what information we collect and why—in plain English."
      />

      <div className="space-y-12 mt-12">
        <PolicySection title="The Short Version">
          <p>
            We collect the information you provide to run the platform—your
            profile, challenges, and submissions. We use industry-standard
            services for payments and never see your full credit card details.
            We will never sell your personal data.
          </p>
        </PolicySection>

        <PolicySection title="Information We Collect">
          <>
            <h4>Account & Profile Data</h4>
            <p>
              When you register, we collect your name and email. To build your
              profile, you can voluntarily provide additional information like a
              bio, skill tags, company name, and links to your portfolio or
              social media. This data is used to represent you on the platform.
            </p>
            <h4>Challenge & Submission Data</h4>
            <p>
              We store the content you create. For clients, this includes
              challenge requirements, prize details, and resource files. For
              developers, this includes your submission descriptions, GitHub
              repository links, live demo URLs, and any uploaded solution files.
            </p>
            <h4>Financial Data</h4>
            <p>
              When a client funds a prize, we use a secure third-party payment
              processor (like Stripe). Your payment details are sent directly to
              them over a secure connection. We do not store sensitive details
              like your full credit card number on our servers.
            </p>
          </>
        </PolicySection>

        <PolicySection title="How We Use Your Information">
          <p>
            Our primary goal is to operate a fair and effective platform. We use
            your information to:
          </p>
          <ul>
            <li>
              <strong>Run the Service:</strong> To host challenges, accept
              submissions, and display user profiles.
            </li>
            <li>
              <strong>Process Payments:</strong> To securely handle prize
              funding from clients and payouts to winning developers.
            </li>
            <li>
              <strong>Communicate With You:</strong> To send essential
              notifications about your account, challenges you've posted, or
              submissions you've made (e.g., email verification, password
              resets, winner announcements).
            </li>
            <li>
              <strong>Maintain Security:</strong> To prevent fraud, enforce our
              terms, and protect the integrity of the platform.
            </li>
            <li>
              <strong>Improve SkillSync:</strong> To analyze usage patterns
              (anonymously where possible) to make our platform better and more
              intuitive.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="Your Control & Rights">
          <p>
            You are in control of your data. You can access and update your
            profile information at any time through your dashboard. If you wish
            to permanently delete your account and all associated data, please
            contact us directly.
          </p>
        </PolicySection>

        <div className="text-center text-base-content/60 pt-8">
          <p>
            This policy may evolve as we grow. We will notify you of any
            significant changes.
            <br />
            Have questions? Reach out to our team.
          </p>
          <a
            href="mailto:privacy@skillsync.app"
            className="link link-primary font-semibold"
          >
            privacy@skillsync.app
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
