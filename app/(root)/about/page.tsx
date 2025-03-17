import React from "react";
import Image from "next/image";

const AboutPage = () => {
  const stats = [
    { id: 1, value: "10+", label: "Years of Experience" },
    { id: 2, value: "50+", label: "Global Partners" },
    { id: 3, value: "1,000+", label: "Projects Completed" },
    { id: 4, value: "100K+", label: "Lives Impacted" },
  ];

  const team = [
    {
      id: 1,
      name: "Jane Smith",
      role: "Executive Director",
      bio: "Leading our strategic initiatives with over 15 years of industry experience.",
      image: "/api/placeholder/200/200",
    },
    {
      id: 2,
      name: "David Chen",
      role: "Research Lead",
      bio: "Pioneering innovative approaches in our core research domains.",
      image: "/api/placeholder/200/200",
    },
    {
      id: 3,
      name: "Amara Johnson",
      role: "Community Director",
      bio: "Building relationships that strengthen our mission and impact.",
      image: "/api/placeholder/200/200",
    },
    {
      id: 4,
      name: "Michael Rodriguez",
      role: "Technology Officer",
      bio: "Driving technological innovation to support our programs.",
      image: "/api/placeholder/200/200",
    },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary py-24 lg:py-32">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-green-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              About{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Our Mission</span>
                <svg className="absolute -bottom-2 left-0 h-3 w-full translate-y-2 text-blue-200" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">Dedicated to creating positive change through innovation, collaboration, and commitment to excellence.</p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">Our Story</h2>
            <div className="mt-10 space-y-6 text-lg text-muted-foreground">
              <p>
                Founded in 2012, our organization began with a simple yet powerful vision: to bridge the gap between cutting-edge research and real-world applications. What started as a small team of dedicated professionals has grown into a
                global community of innovators, researchers, and change-makers.
              </p>
              <p>
                Through the years, we&apos;ve remained committed to our core values of integrity, collaboration, and excellence. These principles guide every project we undertake and every partnership we form. Our journey has been marked by
                continuous learning and adaptation, allowing us to stay at the forefront of our field.
              </p>
              <p>
                Today, we&apos;re proud to work alongside leading institutions, governments, and communities worldwide. Together, we&apos;re tackling some of the most pressing challenges of our time, creating solutions that are not only
                innovative but sustainable and accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 py-16 lg:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute right-1/3 bottom-1/3 h-64 w-64 rounded-full bg-green-100/50 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-lg grid-cols-2 gap-8 sm:max-w-xl lg:max-w-none lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="group relative flex flex-col items-center rounded-xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50 to-green-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                  <p className="mb-2 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
                    <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{stat.value}</span>
                  </p>
                  <p className="text-sm font-medium uppercase tracking-wider text-gray-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Team Section */}
      {/* <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Leadership Team</h2>
            <p className="mt-4 text-lg text-gray-600">Meet the dedicated individuals leading our mission and driving our vision forward.</p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.id} className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 overflow-hidden rounded-full">
                    <Image src={member.image} alt={member.name} width={200} height={200} className="transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-blue-600">{member.role}</p>
                  <p className="mt-3 text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Values Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary py-16 lg:py-24">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/2 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-green-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Our Core Values</h2>
            <p className="mt-4 text-lg text-muted-foreground">The principles that guide our work and define our culture</p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Innovation", description: "We embrace creative thinking and pioneering approaches to solve complex challenges." },
              { title: "Collaboration", description: "We believe in the power of partnerships and collective effort to create lasting impact." },
              { title: "Integrity", description: "We maintain the highest ethical standards in all our endeavors and relationships." },
              { title: "Excellence", description: "We strive for exceptional quality and continuous improvement in everything we do." },
              { title: "Inclusivity", description: "We value diverse perspectives and ensure our work benefits all communities." },
              { title: "Sustainability", description: "We develop solutions that create positive long-term outcomes for people and planet." },
            ].map((value, index) => (
              <div key={index} className="group relative rounded-xl bg-secondary p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-xl font-bold text-blue-600">{index + 1}</span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-muted-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 px-6 py-16 sm:px-12 sm:py-20 lg:py-24">
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-3xl text-center text-white">
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Join Us in Making a Difference</h2>
              <p className="mt-6 text-lg">Whether through partnership, collaboration, or support, there are many ways to be part of our mission.</p>
              <div className="mt-10 flex justify-center space-x-4">
                <button className="rounded-full bg-white px-8 py-3 font-medium text-blue-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl">Contact Us</button>
                <button className="rounded-full border border-white bg-transparent px-8 py-3 font-medium text-white transition-all hover:bg-white/10">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
