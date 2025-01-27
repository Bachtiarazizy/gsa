import Navbar from "@/components/landing-page/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar />
      {children}
    </div>
  );
}
