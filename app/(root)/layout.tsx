import Footer from "./_components/footer";
import Navbar from "./_components/navbar";
import ScrollProvider from "./_components/providers/scroll-provider";
import PageTransition from "./_components/animation/page-transition";
import StickyThemeToggler from "./_components/providers/theme-toogle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar />
      <PageTransition>
        <ScrollProvider>
          <StickyThemeToggler />
          {children}
        </ScrollProvider>
      </PageTransition>
      <Footer />
    </div>
  );
}
