"use client";

import { useEffect, useState } from "react";
import InstagramFeed from "./InstagramFeed";

export default function InstagramFeedsContainer() {
  const [profiles, setProfiles] = useState<{ username: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('http://localhost:3001/instagram/public-profiles');
        if (res.ok) {
          const data = await res.json();
          setProfiles(data);
        }
      } catch (error) {
        console.error('Error fetching public profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-gray-200 rounded-md animate-pulse mb-12"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (profiles.length === 0) {
    // Fallback if no public profiles are set
    return <InstagramFeed username="nehaz_aaura" />;
  }

  return (
    <>
      {profiles.map((profile, index) => (
        <InstagramFeed key={profile.username} username={profile.username} />
      ))}
    </>
  );
}
