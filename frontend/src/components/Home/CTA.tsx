import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-32 text-center border-b border-base-300/100">
      <div className="space-y-6">
        <h2 className="text-5xl font-bold">Ready to Redefine Talent?</h2>
        <p className="text-lg text-base-content/70 max-w-xl mx-auto">
          Join the platform that values skill above all else. Whether you're
          looking to hire or prove your talent, your journey starts here.
        </p>
        <Link href="/register" className="btn btn-primary">
          Get Started for Free
        </Link>
      </div>
    </section>
  );
};

export default CTA;
