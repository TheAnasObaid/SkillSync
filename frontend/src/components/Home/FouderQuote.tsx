import { FaQuoteLeft } from "react-icons/fa"; // Using a more appropriate icon for a quote
const FounderQuote = () => (
  <section className="py-20">
    <div className="max-w-3xl mx-auto text-center relative">
      {/*
This is the decorative quote mark. It's positioned absolutely behind the card
to add a professional, typographic feel without being distracting.
*/}
      <FaQuoteLeft className="absolute -top-8 -left-8 text-9xl text-base-content/5 z-0" />
      <div className="card bg-base-200/50 border border-base-300 shadow-xl z-10">
        <div className="card-body items-center space-y-6 p-10">
          <div className="avatar">
            {/* The ring around the avatar now uses the primary color and has an offset for more depth */}
            <div className="w-32 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-4">
              <img src="/founder.png" alt="Founder Anas Obaid" />
            </div>
          </div>

          {/* 
        The blockquote is now broken into paragraphs for better readability.
        The final "punchline" is given more emphasis.
      */}
          <blockquote className="text-xl leading-relaxed text-base-content/80 space-y-4">
            <p>
              "The most frustrating part of the tech world isn't building the
              product - it's the process of connecting. Developers waste hours
              on proposals that are never read, while clients gamble on resumes
              that can't guarantee skill."
            </p>
            <p>
              "SkillSync ends that guesswork. A straightforward platform where
              businesses post a real pain, and developers prove their ability by
              solving it."
            </p>
            <p className="text-2xl font-semibold text-base-content/90 tracking-tight">
              No more noise, just results.
            </p>
          </blockquote>

          <div className="border-t border-base-300 w-1/3 pt-6">
            <p className="font-bold text-xl text-primary">Anas Obaid</p>
            <p className="text-base-content/50">Founder & CEO, SkillSync</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FounderQuote;
