import type { Metadata } from 'next';

// Metadata should be handled by a server component, so no "use client" here
export const metadata: Metadata = {
  title: "Semesterbyte",
  description: "Byt semesterbostad med andra",
};

export default function MetadataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
