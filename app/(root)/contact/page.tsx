import React from "react";
import Image from "next/image";

const ContactPage = () => {
  const contactMethods = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email Us",
      description: "Our friendly team is here to help.",
      contact: "hello@example.com",
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "Call Us",
      description: "Mon-Fri from 8am to 5pm.",
      contact: "+1 (555) 123-4567",
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Visit Us",
      description: "Come say hello at our office.",
      contact: "123 Innovation Street, Tech City, TC 10010",
    },
  ];

  const officeLocations = [
    { id: 1, city: "New York", address: "123 Innovation Street, Tech City, TC 10010", image: "/api/placeholder/400/300" },
    { id: 2, city: "San Francisco", address: "456 Progress Avenue, Innovation District, CA 94103", image: "/api/placeholder/400/300" },
    { id: 3, city: "London", address: "789 Development Lane, Tech Park, London, SW1A 1AA", image: "/api/placeholder/400/300" },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white py-24 lg:py-32">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-green-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Get in{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Touch</span>
                <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-blue-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">We&apos;d love to hear from you. Let us know how we can help.</p>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {contactMethods.map((method) => (
              <div key={method.id} className="group relative rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50 to-green-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-300 group-hover:bg-blue-200">{method.icon}</div>

                  <h3 className="mb-2 text-xl font-bold text-gray-900">{method.title}</h3>
                  <p className="mb-3 text-sm text-gray-600">{method.description}</p>
                  <p className="font-medium text-blue-600 transition-colors duration-300 group-hover:text-green-600">{method.contact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white py-16 lg:py-24">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute right-1/3 bottom-1/3 h-64 w-64 rounded-full bg-green-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Send Us a Message</h2>
            <p className="mt-4 text-lg text-gray-600">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
          </div>

          <div className="mt-12 mx-auto max-w-2xl">
            <form className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <input type="text" id="first-name" name="first-name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>

                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input type="text" id="last-name" name="last-name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone (optional)
                </label>
                <input type="tel" id="phone" name="phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input type="text" id="subject" name="subject" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-green-600 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-green-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Office Locations Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Offices</h2>
            <p className="mt-4 text-lg text-gray-600">Visit us at one of our locations around the world.</p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {officeLocations.map((office) => (
              <div key={office.id} className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="h-48 overflow-hidden">
                  <Image src={office.image} alt={`${office.city} office`} width={400} height={300} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{office.city}</h3>
                  <p className="text-gray-600">{office.address}</p>

                  <div className="mt-4">
                    <a href="#" className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors group-hover:text-green-600">
                      View on map
                      <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white py-16 lg:py-24">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/2 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-green-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600">Find answers to common questions about working with us.</p>
          </div>

          <div className="mt-12 mx-auto max-w-3xl divide-y divide-gray-200">
            {[
              {
                question: "How quickly can I expect a response to my inquiry?",
                answer: "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call our dedicated support line.",
              },
              {
                question: "Do you offer virtual meetings?",
                answer: "Yes, we offer virtual meetings via Zoom, Microsoft Teams, or Google Meet. Simply request a virtual meeting when you contact us, and we'll send you the necessary details.",
              },
              {
                question: "What information should I prepare before contacting you?",
                answer: "To help us assist you more efficiently, please prepare a brief description of your project or inquiry, your timeline, and any specific questions you might have.",
              },
              {
                question: "Can I schedule a tour of your facilities?",
                answer: "Absolutely! We welcome visitors to our offices. Please contact us at least 48 hours in advance to schedule a tour, and we'll be happy to show you around.",
              },
              {
                question: "How can I join your team?",
                answer: "We're always looking for talented individuals to join our team. Visit our Careers page to see current openings and application procedures.",
              },
            ].map((faq, index) => (
              <div key={index} className="py-6">
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 px-6 py-16 sm:px-12 sm:py-20">
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-xl text-center text-white">
              <h2 className="text-3xl font-bold">Stay Updated</h2>
              <p className="mt-4 text-lg">Subscribe to our newsletter for the latest news, updates, and insights.</p>

              <form className="mt-8 sm:flex">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input id="email-address" name="email" type="email" autoComplete="email" required className="w-full rounded-l-md px-5 py-3 text-gray-900 placeholder-gray-500 focus:outline-none sm:max-w-xs" placeholder="Enter your email" />
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <button type="submit" className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 hover:bg-gray-100">
                    Subscribe
                  </button>
                </div>
              </form>

              <p className="mt-3 text-sm text-white/80">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
