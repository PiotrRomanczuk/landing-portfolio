import Link from "next/link";
import { personalInfo } from "@/lib/data/personal";

export function V5Contact() {
  return (
    <section className="v5-contact" id="contact" aria-labelledby="contact-h">
      <header className="v5-section-head">
        <h2 id="contact-h">For hire, for now.</h2>
        <div className="right">May 2026</div>
      </header>
      <div className="grid">
        <p className="pitch">
          Looking for a <em>senior fullstack</em> role.
          <br />
          Write to{" "}
          <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>.
        </p>
        <aside className="rail">
          <div>
            <h4>Channels</h4>
          </div>
          <a href={`mailto:${personalInfo.email}`}>
            <span>Email</span>
            <span>↗</span>
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>GitHub</span>
            <span>↗</span>
          </a>
          <a
            href="https://www.linkedin.com/in/piotr-romanczuk/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>LinkedIn</span>
            <span>↗</span>
          </a>
          <Link href="/cv">
            <span>CV</span>
            <span>↗</span>
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default V5Contact;
