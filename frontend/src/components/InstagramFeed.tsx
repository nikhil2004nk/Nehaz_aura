"use client";
import { environment } from '../config/environment';
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Play } from "lucide-react";

interface InstagramPost {
  id: string;
  url: string;
  type: string;
  caption: string;
  displayUrl: string;
  videoUrl?: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
}

interface InstagramProfile {
  username: string;
  fullName: string;
  profilePicUrl: string;
  postsCount: number;
  followersCount: number;
  followsCount: number;
  biography: string;
}

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function InstagramFeed({ username = "nehaz_aaura" }: { username?: string }) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, profileRes] = await Promise.all([
          fetch(`${environment.apiUrl}/instagram/posts?username=${username}`),
          fetch(`${environment.apiUrl}/instagram/profile?username=${username}`)
        ]);
        
        if (postsRes.ok) {
          const data = await postsRes.json();
          setPosts(data);
        }
        
        if (profileRes.ok) {
          const profileText = await profileRes.text();
          if (profileText) {
            const profileData = JSON.parse(profileText);
            if (profileData && profileData.username) {
              setProfile(profileData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching Instagram data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username]);

  // Format number (e.g., 10794 -> 10.7K)
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="h-10 w-64 bg-gray-200 rounded-md animate-pulse mb-4"></div>
              <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse hidden md:block"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Hide the entire section if no posts
  if (posts.length === 0) return null;

  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
              Latest from <span className="italic text-gray-400">Instagram</span>
            </h2>
            <p className="text-gray-500">Follow along for daily flows, inspiration, and community.</p>
          </div>
          <a 
            href={`https://www.instagram.com/${username}/`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-gray-900 font-medium hover:text-gray-600 transition-colors mt-6 md:mt-0"
          >
            <InstagramIcon size={20} />
            @{username.toUpperCase()}
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts
            .filter((post) => 
              (post.displayUrl && post.displayUrl !== 'null' && post.displayUrl !== 'undefined') || 
              (post.videoUrl && post.videoUrl !== 'null' && post.videoUrl !== 'undefined')
            )
            .map((post, idx) => {
              const isVideo = !post.displayUrl && post.videoUrl;
              const mediaUrl = post.displayUrl || post.videoUrl;
              
              return (
                <motion.a
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative aspect-square overflow-hidden bg-beige-light rounded-xl shadow-sm"
                >
                  {/* Post Media */}
                  {isVideo ? (
                    <video 
                      src={`${environment.apiUrl}/instagram/image?url=${encodeURIComponent(mediaUrl as string)}`}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={`${environment.apiUrl}/instagram/image?url=${encodeURIComponent(mediaUrl as string)}`} 
                      alt={post.caption?.substring(0, 50) || "Instagram post"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-5 backdrop-blur-[2px]">
                    {post.viewsCount > 0 && (
                      <div className="flex items-center gap-1.5 text-white">
                        <Play fill="currentColor" size={18} />
                        <span className="font-medium">{formatNumber(post.viewsCount)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-white">
                      <Heart fill="currentColor" size={18} />
                      <span className="font-medium">{formatNumber(post.likesCount)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <MessageCircle fill="currentColor" size={18} />
                      <span className="font-medium">{formatNumber(post.commentsCount)}</span>
                    </div>
                  </div>
                </motion.a>
              );
            })}

          {/* Promotional Card to fill empty grid space */}
          {(() => {
            if (posts.length === 0 || posts.length >= 12) return null;
            
            // Calculate remaining spots
            const remLg = posts.length % 4 === 0 ? 0 : 4 - (posts.length % 4);
            const remMd = posts.length % 3 === 0 ? 0 : 3 - (posts.length % 3);
            const remSm = posts.length % 2 === 0 ? 0 : 2 - (posts.length % 2);

            // Hardcode classes for Tailwind JIT
            const lgClass = remLg === 3 ? "lg:col-span-3 lg:aspect-[3/1] lg:flex" : remLg === 2 ? "lg:col-span-2 lg:aspect-[2/1] lg:flex" : remLg === 1 ? "lg:col-span-1 lg:aspect-square lg:flex" : "lg:hidden";
            const mdClass = remMd === 2 ? "md:col-span-2 md:aspect-[2/1] md:flex" : remMd === 1 ? "md:col-span-1 md:aspect-square md:flex" : "md:hidden";
            const smClass = remSm === 1 ? "col-span-1 aspect-square flex" : "hidden";

            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-xl shadow-sm bg-gradient-to-br from-beige to-beige-light flex flex-col items-center justify-center p-4 text-center border border-gray-100 ${smClass} ${mdClass} ${lgClass}`}
              >
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
                {profile ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`${environment.apiUrl}/instagram/image?url=${encodeURIComponent(profile.profilePicUrl)}`}
                      alt={profile.fullName}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white shadow-sm mb-3 md:mb-4 object-cover"
                    />
                    <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-1">{profile.fullName}</h3>
                    <div className="flex gap-4 text-sm font-medium text-gray-600 mb-3">
                      <span>{formatNumber(profile.followersCount)} Followers</span>
                      <span>{profile.postsCount} Posts</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-4 max-w-sm px-4 hidden md:block">
                      {profile.biography.split('\n')[1] || "Join our growing community."}
                    </p>
                  </>
                ) : (
                  <>
                    <InstagramIcon size={32} className="text-gray-900 mb-2 md:mb-4" />
                    <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-1 md:mb-2">Join the Community</h3>
                    <p className="text-sm md:text-base text-gray-600 mb-4 max-w-sm px-4">
                      Follow @{username} for daily flows, wellness tips, and a growing community.
                    </p>
                  </>
                )}
                
                <a
                  href={`https://www.instagram.com/${username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2 md:px-6 md:py-3 bg-gray-900 text-white rounded-full text-sm md:text-base font-medium hover:bg-gray-800 transition-colors z-10"
                >
                  Follow on Instagram
                </a>
              </motion.div>
            );
          })()}
        </div>

        <div className="mt-8 text-center md:hidden">
          <a 
            href={`https://www.instagram.com/${username}/`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-foreground"
          >
            <InstagramIcon size={14} />
            Follow @{username}
          </a>
        </div>

      </div>
    </section>
  );
}
