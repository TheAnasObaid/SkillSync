const FounderQuote = () => (
  <section className="py-20">
    <div className="max-w-3xl mx-auto text-center">
      <div className="card bg-base-200/50 border border-base-300 shadow-xl">
        <div className="card-body items-center space-y-6 p-10">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="/founder.png" alt="Founder Anas Obaid" />
            </div>
          </div>

          <blockquote className="text-xl leading-relaxed text-base-content/60">
            “The most frustrating part of the tech world isn&apos;t building the
            product - it&apos;s the process of connecting. Developers waste
            hours on proposals that are never read, while clients gamble on
            resumes that can&apos;t guarantee skill.
            <br />
            SkillSync ends that guesswork. A straightforward platform where
            businesses post a real pain, and developers prove their ability by
            solving it.
            <br />
            <strong className="font-semibold text-base-content">
              No more noise, just results.
            </strong>
            "
          </blockquote>

          <div className="text-center">
            <p className="font-bold text-xl text-primary">Anas Obaid</p>
            <p className="text-base-content/50 italic">Founder of SkillSync</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FounderQuote;
