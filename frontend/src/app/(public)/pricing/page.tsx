import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

const PricingPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 px-4">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Simple, Success-Based Pricing
        </h1>
        <p className="mt-4 text-lg text-base-content/80 max-w-2xl mx-auto">
          No subscriptions. No hidden fees. You only pay for results. Our
          transparent model ensures you get maximum value for finding top-tier
          talent.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 mt-16 items-center">
        {/* --- The Pricing Card --- */}
        <div className="card bg-primary/10 border-2 border-primary shadow-2xl">
          <div className="card-body p-8">
            <h2 className="card-title text-3xl font-bold">Pay-Per-Challenge</h2>
            <p className="text-base-content/70">
              Our straightforward, percentage-based platform fee.
            </p>
            <div className="my-6">
              <span className="text-5xl font-extrabold">10%</span>
              <span className="text-xl font-medium text-base-content/60">
                {" "}
                / successful challenge
              </span>
            </div>
            <p className="font-semibold">How it Works:</p>
            <div className="text-sm p-4 bg-base-200/50 rounded-lg">
              <p>
                <span className="font-bold">You set the prize:</span> $1,000
              </p>
              <p>
                <span className="font-bold">Platform Fee (10%):</span> + $100
              </p>
              <div className="divider my-1"></div>
              <p className="font-bold">Total Cost to You: $1,100</p>
            </div>
          </div>
        </div>

        {/* --- The "What's Included" Card --- */}
        <div className="card bg-base-200/50 border border-base-300">
          <div className="card-body p-8">
            <h3 className="card-title text-xl font-bold">
              Everything you need to hire with confidence:
            </h3>
            <ul className="mt-4 space-y-3 text-base-content/90">
              <li className="flex items-start gap-3">
                <FiCheckCircle className="text-success mt-1 flex-shrink-0" />{" "}
                <span>Unlimited developer submissions</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheckCircle className="text-success mt-1 flex-shrink-0" />{" "}
                <span>Access to our global talent pool</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheckCircle className="text-success mt-1 flex-shrink-0" />{" "}
                <span>Secure prize funding and payout processing</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheckCircle className="text-success mt-1 flex-shrink-0" />{" "}
                <span>Advanced submission review and feedback tools</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheckCircle className="text-success mt-1 flex-shrink-0" />{" "}
                <span>Profile visibility for all participating developers</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheckCircle className="text-success mt-1 flex-shrink-0" />{" "}
                <span>Standard email support</span>
              </li>
            </ul>
            <div className="card-actions mt-6">
              <Link
                href="/client/dashboard/create"
                className="btn btn-primary w-full"
              >
                Post a Challenge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="collapse collapse-plus bg-base-200/50 border border-base-300">
            <input type="radio" name="pricing-faq" defaultChecked />
            <div className="collapse-title text-xl font-medium">
              What happens if I don't select a winner?
            </div>
            <div className="collapse-content">
              <p>
                If you do not find a submission that meets your standards and do
                not select a winner, you are not charged the platform fee. Your
                funded prize money is returned to you, minus any standard
                payment processing fees.
              </p>
            </div>
          </div>
          <div className="collapse collapse-plus bg-base-200/50 border border-base-300">
            <input type="radio" name="pricing-faq" />
            <div className="collapse-title text-xl font-medium">
              Are there any other costs?
            </div>
            <div className="collapse-content">
              <p>
                No. Our model is designed for transparency. The only cost is the
                10% platform fee on top of the prize you set for the winning
                developer. Standard credit card processing fees may apply from
                our payment provider (Stripe).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
