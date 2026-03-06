export function V4Footer() {
  return (
    <footer className="max-w-[1100px] mx-auto px-8 py-6 border-t border-[var(--border)] flex justify-between text-xs text-[#AAA]">
      <span>&copy; {new Date().getFullYear()} Piotr Romanczuk</span>
      <span>Warsaw, Poland</span>
    </footer>
  );
}
