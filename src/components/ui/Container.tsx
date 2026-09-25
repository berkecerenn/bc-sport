import type { ReactNode } from "react";
import styles from "./Container.module.css";

type Props = {
  children: ReactNode;
  className?: string;
};

// İçeriği ortalayıp genişliğini sınırlayan ortak kutu (legacy'deki .kapsayici).
export function Container({ children, className }: Props) {
  return (
    <div className={className ? `${styles.container} ${className}` : styles.container}>
      {children}
    </div>
  );
}
