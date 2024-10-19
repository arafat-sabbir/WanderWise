import React from 'react';
import Container from "@/components/Shared/Container";
import { Globe, Users, BookOpen, Award, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const AboutUs = () => {
  // Fake team data
  const teamMembers = [
    {
      name: "John Doe",
      role: "Founder & CEO",
      image: "/man.png"
    },
    {
      name: "Jane Smith",
      role: "Travel Content Director",
      image: "/man.png"
    },
    {
      name: "Robert Johnson",
      role: "Community Manager",
      image: "/man.png"
    },
    {
      name: "Emily Davis",
      role: "Marketing Specialist",
      image: "/man.png"
    }
  ];

  return (
    <Container>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* About Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-blue-600">
          About Travel Tips & Destination Guides
        </h1>
        
        {/* Intro Section */}
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-gray-700 mb-6">
            Your gateway to unforgettable adventures and expert travel insights
          </p>
          <div className="flex justify-center">
            <Globe className="text-blue-500 w-16 h-16" />
          </div>
        </div>

        {/* Our Mission & What We Offer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-blue-600">
              <Users className="mr-2" /> Our Mission
            </h2>
            <p className="text-gray-600">
              We empower travelers worldwide by providing a platform to share stories, tips, and experiences. Our mission is to inspire and inform, believing that every journey has the potential to change lives and broaden perspectives.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-blue-600">
              <BookOpen className="mr-2" /> What We Offer
            </h2>
            <p className="text-gray-600">
              From user-generated content to premium travel guides, we offer a wealth of information to help you plan your next adventure. Our platform combines authentic traveler experiences with expert insights to create a comprehensive resource for globetrotters.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Award className="mx-auto text-blue-500 w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Curated content from seasoned travelers and local experts</p>
            </div>
            <div className="text-center">
              <Users className="mx-auto text-blue-500 w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community-Driven</h3>
              <p className="text-gray-600">Connect with fellow travelers and share your own experiences</p>
            </div>
            <div className="text-center">
              <MapPin className="mx-auto text-blue-500 w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
              <p className="text-gray-600">Discover insights on destinations around the world</p>
            </div>
          </div>
        </div>

        {/* Join Our Community */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-blue-600">Join Our Community</h2>
          <p className="text-xl text-gray-700 mb-8">
            Become a part of our growing family of travel enthusiasts. Share your stories, learn from others, and embark on your next adventure with confidence.
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 text-lg"
          >
            Start Your Journey
          </Link>
        </div>

        {/* Our Team Section */}
        <div className="bg-gray-100 rounded-lg p-8">
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AboutUs;
