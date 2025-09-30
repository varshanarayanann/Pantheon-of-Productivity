import React from 'react';
import './About.css'; // Your CSS file for styling

// Define an interface for the team member data
interface TeamMember {
  name: string;
  image: string; // The path to the member's image
}

const team: TeamMember[] = [
  {
    name: "Forum Shah",
    image: "/images/team/member1.jpg", // Update with your image paths
  },
  {
    name: "Varsha Narayanan",
    image: "/images/team/member2.jpg", // Update with your image paths
  },
  {
    name: "Ananya Raghunath",
    image: "/images/team/member3.jpg", // Update with your image paths
  },
  {
    name: "Carlin Verano",
    image: "/images/team/member4.jpg", // Update with your image paths
  },
];

const About: React.FC = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>Pantheon of Productivity</h1>
        <p>Harness the power of ancient deities to master your modern-day tasks.</p>
      </header>

      <section className="about-intro">
        <p>
          Welcome to the Pantheon of Productivity, a unique project inspired by the timeless wisdom and power of Greek mythology. In a world full of distractions, we believe that focus and organization can be found in the archetypal strengths of the gods and goddesses of Olympus.
        </p>
        <p>
          Our mission is to create an all-in-one productivity hub where each tool is personified by a Greek goddess, guiding you to be more efficient, organized, and inspired.
        </p>
      </section>

      <section className="project-features">
        <h2>What Awaits You</h2>
        <ul>
          <li><strong>An Assignment Tracker:</strong> Plot your course and conquer every deadline.</li>
          <li><strong>A Built-in Tutor:</strong> Let Hermes be your guide to new knowledge, with instant answers and learning resources.</li>
          <li><strong>A Music Player:</strong> Invoke Euterpe's inspiration and find your focus with the perfect soundtrack for every task.</li>
          <li><strong>A Habit Tracker:</strong> Build a foundation of consistency with Hestia, the guardian of your daily routines.</li>
        </ul>
      </section>

      <section className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-cards-container">
          {team.map((member) => (
            <div key={member.name} className="team-member-card">
              <img src={member.image} alt={member.name} className="team-member-image" />
              <h3>{member.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <footer className="about-footer">
        <p>Join us on this epic journey to redefine your productivity and become the hero of your own story.</p>
      </footer>
    </div>
  );
};

export default About;