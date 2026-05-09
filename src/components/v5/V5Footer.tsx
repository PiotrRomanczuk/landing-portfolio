export function V5Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="v5-colophon" role="contentinfo">
      <div>© {year} Piotr Romanczuk</div>
      <div className="center">
        Set in Newsreader &amp; JetBrains Mono. Built with Next.js.
      </div>
      <div className="right">
        <a
          href="https://github.com/PiotrRomanczuk/landing-portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          v5 source ↗
        </a>
      </div>
    </footer>
  );
}

export default V5Footer;
