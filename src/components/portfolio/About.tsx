interface AboutProps {
  aboutText?: string;
}

export const About = ({ aboutText }: AboutProps) => {
  const defaultText = 'I specialize in translating complex datasets into clear, actionable insights that empower stakeholders to make confident decisions. With hands-on experience in SQL, dashboard development, and reporting automation, I deliver data solutions that directly contribute to operational efficiency and revenue growth.';
  
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">About</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {aboutText || defaultText}
        </p>
      </div>
    </section>
  );
};
