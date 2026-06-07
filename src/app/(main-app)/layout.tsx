import Header from "@/components/Header";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
    </>
  );
}
