import "../styles/about.css";

const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <h1 className="about-title">About Finance Insights</h1>
        
        {/* Mission Section */}
        <section className="about-section-item">
          <h2 className="about-subtitle">Our Mission</h2>
          <p>
            At Finance Insights, we strive to provide accurate, insightful, and 
            up-to-date financial news, investment strategies, and economic analysis 
            to empower individuals and businesses.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="about-section-item">
          <h2 className="about-subtitle">Why Choose Us?</h2>
          <ul className="about-list">
            <li>✅ Expert financial analysis</li>
            <li>✅ Latest insights on investing, crypto, real estate, and more</li>
            <li>✅ Easy-to-understand finance guides</li>
          </ul>
        </section>

        {/* Our Team */}
        <section className="about-section-item">
          <h2 className="about-subtitle">Meet Our Team</h2>
          <p>
            Our team consists of financial analysts, economists, and tech-savvy writers 
            dedicated to providing valuable content to our readers.
          </p>
        </section>
      </div>
    </section>
  );
};

export default About;
