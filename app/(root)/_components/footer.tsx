import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">GlobalSkills</span>
            </Link>
            <p className="text-gray-600 max-w-sm">Empowering learners worldwide with industry-relevant courses designed by leading experts.</p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6">Quick Links</h3>
            <FooterLinks
              links={[
                { label: "About Us", href: "/about" },
                { label: "Courses", href: "/courses" },
                { label: "Pricing", href: "/pricing" },
                { label: "Contact", href: "/contact" },
              ]}
            />
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6">Resources</h3>
            <FooterLinks
              links={[
                { label: "Blog", href: "/blog" },
                { label: "Career Guide", href: "/career-guide" },
                { label: "Success Stories", href: "/success-stories" },
                { label: "Help Center", href: "/help" },
              ]}
            />
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6">Legal</h3>
            <FooterLinks
              links={[
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Cookie Policy", href: "/cookies" },
                { label: "Accessibility", href: "/accessibility" },
              ]}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-center text-gray-600">© {new Date().getFullYear()} GlobalSkills Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

const SocialLink = ({ href, icon }: SocialLinkProps) => (
  <Link href={href} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gradient-to-r hover:from-green-600 hover:to-blue-600 hover:text-white">
    {icon}
  </Link>
);

interface FooterLink {
  label: string;
  href: string;
}

const FooterLinks = ({ links }: { links: FooterLink[] }) => (
  <ul className="space-y-4">
    {links.map((link) => (
      <li key={link.label}>
        <Link href={link.href} className="text-gray-600 transition-colors hover:text-gray-900">
          {link.label}
        </Link>
      </li>
    ))}
  </ul>
);

export default Footer;
