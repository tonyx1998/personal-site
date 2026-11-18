import styles from "./ProjectDetail.module.css";

export default function SectionContents({
  sections,
  prefix,
}: {
  sections: { title: string }[];
  prefix: string;
}) {
  return (
    <nav className={styles.contents} aria-label="On this page">
      <h2>On this page</h2>
      <ul>
        {sections.map((section, index) => (
          <li key={section.title}>
            <a href={`#${prefix}-${index}`}>{section.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
