import styles from "./SkipLink.module.css";

type Props = {
  label: string;
};

// Klavye ile gezinen kullanıcıların üst menüyü atlayıp doğrudan ana içeriğe
// geçmesini sağlar. Body'nin ilk odaklanabilir öğesi olmalı; normalde görünmez,
// yalnızca klavye odağı aldığında görünür hale gelir.
export function SkipLink({ label }: Props) {
  return (
    <a href="#icerik" className={styles.skipLink}>
      {label}
    </a>
  );
}
