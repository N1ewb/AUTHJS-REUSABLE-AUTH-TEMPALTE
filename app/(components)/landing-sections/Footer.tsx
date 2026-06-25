import Link from "next/link";
import React from "react";

const links = {
  Platform: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "For Students", href: "/studentregistration" },
    { label: "For Instructors", href: "/instructorregistration" },
  ],
  Support: [
    { label: "FAQ", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#56205E] text-white">
      <div className="max-w-6xl mx-auto px-12 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-wide">
              YLQ
            </Link>
            <p className="mt-4 text-sm text-purple-200 leading-relaxed">
              Live quizzes made simple. Learn, teach, and compete in real time.
            </p>
          </div>
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                {heading}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-purple-200 hover:text-white transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-purple-400/20">
        <div className="max-w-6xl mx-auto px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-purple-300">
          <p>&copy; {new Date().getFullYear()} YLQ. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="https://www.linkedin.com/in/nathaniel-lucero-a882a2369/"
              className="hover:text-white transition"
            >
              Linked In
            </Link>
            <Link
              href="https://github.com/N1ewb"
              className="hover:text-white transition"
            >
              GitHub
            </Link>
            <Link
              href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=nathaniellucero20@gmail.com"
              className="hover:text-white transition"
            >
              Email
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
