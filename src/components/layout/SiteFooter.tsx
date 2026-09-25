import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import styles from "./SiteFooter.module.css";

type Props = {
  dictionary: Dictionary;
};

export function SiteFooter({ dictionary }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <p>{dictionary.footer.description}</p>
        <p className={styles.rights}>
          © {year} {dictionary.site.name}. {dictionary.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
