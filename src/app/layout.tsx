import type { ReactNode } from "react";

// Gerçek <html>/<body> etiketleri src/app/[locale]/layout.tsx içinde tanımlanır,
// çünkü dil segmenti (`locale`) parametresi orada belli olur. Bu kök layout
// yalnızca App Router'ın zorunlu kıldığı geçiş katmanıdır.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
