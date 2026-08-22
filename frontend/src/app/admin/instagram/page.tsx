"use client";

import React, { useState, useEffect } from "react";
import { Camera, Edit2, Check, X as XIcon, Link as LinkIcon, RefreshCw, ShieldAlert, EyeOff, Grid, Trash2, Image as ImageIcon, Heart, MessageCircle, Eye, Users, Loader2, CloudDownload } from "lucide-react";
import Image from "next/image";
import { authFetch } from "@/utils/authFetch";
import CustomSelect from "@/components/CustomSelect";
import { environment } from "@/config/environment";

interface InstaProfile {
  username: string;
  fullName: string;
  profilePicUrl: string;
  postsCount: number;
  followersCount: number;
  followsCount: number;
  biography: string;
  isManuallyEdited?: boolean;
  isPublicVisible?: boolean;
}

interface InstaPost {
  id: string;
  url: string;
  displayUrl: string;
  videoUrl?: string;
  type: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  timestamp: string;
  isManuallyEdited?: boolean;
  isHidden?: boolean;
}

export default function InstagramManagementPage() {
  const [profile, setProfile] = useState<InstaProfile | null>(null);
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncingProfile, setIsSyncingProfile] = useState(false);
  const [isSyncingPosts, setIsSyncingPosts] = useState(false);
  const [profileCooldown, setProfileCooldown] = useState(0);
  const [postsCooldown, setPostsCooldown] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Modals state
  const [editingProfile, setEditingProfile] = useState<InstaProfile | null>(null);
  const [editingPost, setEditingPost] = useState<InstaPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [syncPrompt, setSyncPrompt] = useState<{ isOpen: boolean, type: 'profile' | 'posts', username: string } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, postId: string } | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean, type: 'profile' | 'post', id: string, username?: string } | null>(null);

  const [profilesList, setProfilesList] = useState<{ value: string, label: string }[]>([]);
  const [selectedUsername, setSelectedUsername] = useState("nehaz_aaura");

  useEffect(() => {
    fetchProfilesList();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (profileCooldown > 0) {
      timer = setTimeout(() => setProfileCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [profileCooldown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (postsCooldown > 0) {
      timer = setTimeout(() => setPostsCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [postsCooldown]);

  useEffect(() => {
    fetchData();
  }, [selectedUsername]);

  const fetchProfilesList = async () => {
    try {
      const res = await authFetch(`${environment.apiUrl}/instagram/profiles`);
      if (res.ok) {
        const data = await res.json();
        const options = data.map((p: any) => ({ value: p.username, label: `@${p.username}` }));
        setProfilesList(options);

        if (options.length > 0) {
          if (!options.find((o: any) => o.value === selectedUsername)) {
            setSelectedUsername(options[0].value);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, postsRes] = await Promise.all([
        authFetch(`${environment.apiUrl}/instagram/profile?username=${selectedUsername}`),
        authFetch(`${environment.apiUrl}/instagram/posts?username=${selectedUsername}`)
      ]);

      if (profileRes.ok) {
        const text = await profileRes.text();
        if (text) {
          const profileData = JSON.parse(text);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
    } catch (error) {
      console.error("Error fetching Instagram data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncProfile = () => {
    setSyncPrompt({ isOpen: true, type: 'profile', username: 'nehaz_aaura' });
  };

  const handleSyncPosts = () => {
    setSyncPrompt({ isOpen: true, type: 'posts', username: 'nehaz_aaura' });
  };

  const executeSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncPrompt) return;

    const { type, username } = syncPrompt;
    const finalUsername = username.trim().replace('@', '') || "nehaz_aaura";
    setSyncPrompt(null);
    setMessage(null);

    const isProfile = type === 'profile';
    const endpoint = isProfile ? "sync-profile" : "sync";

    isProfile ? setIsSyncingProfile(true) : setIsSyncingPosts(true);

    try {
      const res = await authFetch(`${environment.apiUrl}/instagram/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: finalUsername }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `${isProfile ? 'Profile' : 'Posts'} sync started for @${finalUsername}. It may take a few minutes.` });
        if (isProfile) setProfileCooldown(30);
        else setPostsCooldown(30);
      } else {
        throw new Error(`Failed to start ${type} sync`);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "An error occurred" });
    } finally {
      isProfile ? setIsSyncingProfile(false) : setIsSyncingPosts(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    setIsSaving(true);
    try {
      const res = await authFetch(`${environment.apiUrl}/instagram/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: editingProfile.fullName,
          biography: editingProfile.biography,
          postsCount: Number(editingProfile.postsCount),
          followersCount: Number(editingProfile.followersCount),
          followsCount: Number(editingProfile.followsCount)
        }),
      });
      if (res.ok) {
        setProfile({ ...editingProfile, isManuallyEdited: true });
        setEditingProfile(null);
        setMessage({ type: 'success', text: 'Profile updated and locked from sync.' });
      } else throw new Error("Failed to update");
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setIsSaving(true);
    try {
      const res = await authFetch(`${environment.apiUrl}/instagram/posts/${editingPost.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: editingPost.caption,
          likesCount: Number(editingPost.likesCount),
          commentsCount: Number(editingPost.commentsCount),
          viewsCount: Number(editingPost.viewsCount)
        }),
      });
      if (res.ok) {
        setPosts(posts.map(p => p.id === editingPost.id ? { ...editingPost, isManuallyEdited: true } : p));
        setEditingPost(null);
        setMessage({ type: 'success', text: 'Post updated and locked from sync.' });
      } else throw new Error("Failed to update");
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleHidePost = (id: string) => {
    setConfirmModal({ isOpen: true, postId: id });
  };

  const executeHidePost = async () => {
    if (!confirmModal) return;
    const { postId } = confirmModal;
    setConfirmModal(null);

    try {
      const res = await authFetch(`${environment.apiUrl}/instagram/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: true }),
      });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== postId));
        setMessage({ type: 'success', text: 'Post hidden.' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmModal(null);
    }
  };

  const handleDeleteProfile = async () => {
    if (!deleteConfirmModal || deleteConfirmModal.type !== 'profile') return;

    try {
      const res = await authFetch(`${environment.apiUrl}/instagram/profile/${deleteConfirmModal.username}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile deleted successfully' });
        setDeleteConfirmModal(null);
        setProfile(null);
        setPosts([]);
        fetchProfilesList(); // Refresh the dropdown list
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting profile' });
    }
  };

  const handleDeletePost = async () => {
    if (!deleteConfirmModal || deleteConfirmModal.type !== 'post') return;

    try {
      const res = await authFetch(`${environment.apiUrl}/instagram/posts/${deleteConfirmModal.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== deleteConfirmModal.id));
        setMessage({ type: 'success', text: 'Post deleted successfully' });
        setDeleteConfirmModal(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting post' });
    }
  };

  const handleRefreshData = () => {
    if (selectedUsername) {
      fetchData();
      fetchProfilesList();
      setMessage({ type: 'success', text: 'Data refreshed' });
    }
  };

  const handleToggleVisibility = async (username: string, currentStatus: boolean) => {
    try {
      const res = await authFetch(`${environment.apiUrl}/instagram/profile/${username}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !currentStatus })
      });
      if (res.ok) {
        setProfile(prev => prev ? { ...prev, isPublicVisible: !currentStatus } : null);
        setMessage({ type: 'success', text: `Profile is now ${!currentStatus ? 'visible' : 'hidden'} on the public site.` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error toggling visibility' });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-foreground/30" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-foreground tracking-tight mb-1 flex items-center gap-3">
            Instagram Management
          </h2>
          <p className="text-xs text-foreground/50 uppercase tracking-widest font-medium">
            Manage synced profile data and posts
          </p>
        </div>
        <div className="flex gap-3 self-start sm:self-auto items-center flex-wrap">
          <div className="w-48">
            <CustomSelect
              value={selectedUsername}
              onChange={(e) => setSelectedUsername(e.target.value)}
              options={profilesList}
              size="sm"
              allowClear={false}
            />
          </div>
          <button
            onClick={handleRefreshData}
            className="flex items-center gap-2 px-3 py-2 bg-background border border-foreground/10 text-foreground rounded-xl text-xs font-medium hover:bg-foreground/5 transition-colors h-[34px]"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={handleSyncProfile}
            disabled={isSyncingProfile || profileCooldown > 0}
            className="flex items-center gap-2 px-3 py-2 bg-background border border-foreground/10 text-foreground rounded-xl text-xs font-medium hover:bg-foreground/5 transition-colors disabled:opacity-50 h-[34px]"
          >
            <CloudDownload size={14} className={isSyncingProfile || profileCooldown > 0 ? "animate-pulse text-emerald-500" : ""} />
            {profileCooldown > 0 ? `Syncing (${Math.floor(profileCooldown / 60)}:${(profileCooldown % 60).toString().padStart(2, '0')})` : "Sync Profile"}
          </button>
          <button
            onClick={handleSyncPosts}
            disabled={isSyncingPosts || postsCooldown > 0}
            className="flex items-center gap-2 px-3 py-2 bg-background border border-foreground/10 text-foreground rounded-xl text-xs font-medium hover:bg-foreground/5 transition-colors disabled:opacity-50 h-[34px]"
          > 
            <CloudDownload size={14} className={isSyncingPosts || postsCooldown > 0 ? "animate-pulse text-emerald-500" : ""} />
            {postsCooldown > 0 ? `Syncing (${Math.floor(postsCooldown / 60)}:${(postsCooldown % 60).toString().padStart(2, '0')})` : "Sync Posts"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'
          }`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Stats Section */}
      <section className="bg-background border border-foreground/5 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-8 relative group">
        {profile ? (
          <>
            <button
              onClick={() => handleToggleVisibility(profile.username, !!profile.isPublicVisible)}
              className={`absolute bottom-4 right-4 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider transition-colors shadow-sm ${profile.isPublicVisible
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-foreground/10 text-foreground/50 hover:bg-foreground/20'
                }`}
            >
              {profile.isPublicVisible ? 'Visible on Public Site' : 'Hidden on Public Site'}
            </button>
            <button
              onClick={() => setEditingProfile(profile)}
              className="absolute top-4 right-4 p-2 bg-foreground/5 hover:bg-foreground/10 rounded-full text-foreground/50 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
              title="Edit Profile"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => setDeleteConfirmModal({ isOpen: true, type: 'profile', id: '', username: profile.username })}
              className="absolute top-4 right-14 p-2 bg-red-500/5 hover:bg-red-500/10 rounded-full text-red-500/50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete Profile"
            >
              <Trash2 size={16} />
            </button>
            <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border border-foreground/10 ring-4 ring-background shadow-md">
              <Image
                src={`${environment.apiUrl}/instagram/image?url=${encodeURIComponent(profile.profilePicUrl)}`}
                alt={profile.username}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="text-xl font-bold font-sans tracking-tight">{profile.fullName}</h3>
                {profile.isManuallyEdited && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full" title="Locked from auto-sync">
                    <ShieldAlert size={10} /> Edited
                  </span>
                )}
              </div>
              <a href={`https://instagram.com/${profile.username}`} target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-foreground text-sm font-medium flex items-center justify-center md:justify-start gap-1 mb-2 mt-1">
                @{profile.username} <LinkIcon size={12} />
              </a>
              <p className="text-sm text-foreground/70 max-w-lg whitespace-pre-wrap">{profile.biography}</p>
            </div>
            <div className="flex items-center gap-6 md:gap-10 shrink-0">
              <div className="text-center">
                <span className="block text-2xl font-bold">{formatNumber(profile.postsCount)}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-foreground/50">Posts</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">{formatNumber(profile.followersCount)}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-foreground/50">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold">{formatNumber(profile.followsCount)}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-foreground/50">Following</span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full text-center py-8 text-foreground/50">
            <Camera size={32} className="mx-auto mb-3 opacity-50" />
            <p>No profile data synced yet.</p>
          </div>
        )}
      </section>

      {/* Posts Section */}
      <div>
        <h3 className="text-lg font-serif tracking-tight mb-4 flex items-center gap-2">
          <Grid size={18} /> Cached Posts ({posts.length})
        </h3>
        {posts.length > 0 ? (
          <div className="bg-background border border-foreground/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-foreground/5 bg-foreground/[0.02]">
                    <th className="px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-[10px] w-24">Media</th>
                    <th className="px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-[10px]">Caption</th>
                    <th className="px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-[10px] whitespace-nowrap">Date</th>
                    <th className="px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-[10px]">Likes</th>
                    <th className="px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-[10px]">Comments</th>
                    <th className="px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-[10px]">Views</th>
                    <th className="px-6 py-4 font-semibold text-foreground/60 uppercase tracking-wider text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-foreground/[0.01] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-foreground/5 border border-foreground/10 shrink-0">
                          {post.displayUrl ? (
                            <Image
                              src={`${environment.apiUrl}/instagram/image?url=${encodeURIComponent(post.displayUrl)}`}
                              alt="Instagram post"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : post.videoUrl ? (
                            <video
                              src={`${environment.apiUrl}/instagram/image?url=${encodeURIComponent(post.videoUrl)}`}
                              className="object-cover w-full h-full"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-foreground/30">
                              <ImageIcon size={16} />
                            </div>
                          )}
                          {post.type === 'Video' && (
                            <div className="absolute top-1 right-1 bg-black/40 backdrop-blur-md text-white p-1 rounded-full">
                              <Eye size={10} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          {post.isManuallyEdited && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] uppercase font-bold bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded whitespace-nowrap" title="Locked from auto-sync">
                              <ShieldAlert size={8} /> Edited
                            </span>
                          )}
                        </div>
                        <p className="text-foreground/80 line-clamp-2 max-w-sm">{post.caption || "No caption"}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-foreground/60">
                        {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {formatNumber(post.likesCount)}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {formatNumber(post.commentsCount)}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {formatNumber(post.viewsCount)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingPost(post)}
                            className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors opacity-0 group-hover:opacity-100"
                            title="Edit Post"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleHidePost(post.id)}
                            className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            title="Hide Post"
                          >
                            <EyeOff size={16} />
                          </button>
                          <a href={post.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-colors text-foreground/70 flex items-center justify-center">
                            <LinkIcon size={14} />
                          </a>
                          <button
                            onClick={() => setDeleteConfirmModal({ isOpen: true, type: 'post', id: post.id })}
                            className="p-2 bg-red-500/5 hover:bg-red-500/10 text-red-500/70 hover:text-red-500 rounded-lg transition-colors flex items-center justify-center"
                            title="Delete Post"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-background border border-foreground/5 rounded-3xl">
            <Camera size={32} className="mx-auto mb-3 text-foreground/30" />
            <p className="text-foreground/50 font-medium">No posts currently cached in the database.</p>
            <button onClick={handleSyncPosts} className="mt-4 text-xs font-semibold uppercase tracking-widest text-foreground hover:opacity-70 transition-opacity">
              Run first sync
            </button>
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-foreground/10">
            <div className="px-6 py-4 border-b border-foreground/10 flex justify-between items-center bg-foreground/[0.02]">
              <h3 className="font-serif text-lg font-bold">Edit Profile Stats</h3>
              <button onClick={() => setEditingProfile(null)} className="text-foreground/50 hover:text-foreground">
                <XIcon size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs p-3 rounded-xl flex items-start gap-2 mb-4">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <p>Saving these changes will lock this profile from automatic Apify syncs to protect your manual edits.</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Full Name</label>
                <input required type="text" value={editingProfile.fullName} onChange={e => setEditingProfile({ ...editingProfile, fullName: e.target.value })} className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-foreground/20" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Bio</label>
                <textarea rows={3} value={editingProfile.biography} onChange={e => setEditingProfile({ ...editingProfile, biography: e.target.value })} className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-foreground/20" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Posts</label>
                  <input type="number" value={editingProfile.postsCount} onChange={e => setEditingProfile({ ...editingProfile, postsCount: parseInt(e.target.value) || 0 })} className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-foreground/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Followers</label>
                  <input type="number" value={editingProfile.followersCount} onChange={e => setEditingProfile({ ...editingProfile, followersCount: parseInt(e.target.value) || 0 })} className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-foreground/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Following</label>
                  <input type="number" value={editingProfile.followsCount} onChange={e => setEditingProfile({ ...editingProfile, followsCount: parseInt(e.target.value) || 0 })} className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-foreground/20" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingProfile(null)} className="px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-foreground/5">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl font-medium text-sm bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 flex items-center gap-2">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-foreground/10">
            <div className="px-6 py-4 border-b border-foreground/10 flex justify-between items-center bg-foreground/[0.02]">
              <h3 className="font-serif text-lg font-bold">Edit Post</h3>
              <button onClick={() => setEditingPost(null)} className="text-foreground/50 hover:text-foreground">
                <XIcon size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdatePost} className="p-6 space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs p-3 rounded-xl flex items-start gap-2 mb-4">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <p>Saving these changes will lock this post from automatic Apify syncs to protect your manual edits.</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Caption</label>
                <textarea rows={4} value={editingPost.caption} onChange={e => setEditingPost({ ...editingPost, caption: e.target.value })} className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-foreground/20" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Likes</label>
                  <input type="number" value={editingPost.likesCount} onChange={e => setEditingPost({ ...editingPost, likesCount: parseInt(e.target.value) || 0 })} className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-foreground/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Comments</label>
                  <input type="number" value={editingPost.commentsCount} onChange={e => setEditingPost({ ...editingPost, commentsCount: parseInt(e.target.value) || 0 })} className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-foreground/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Views</label>
                  <input type="number" value={editingPost.viewsCount} onChange={e => setEditingPost({ ...editingPost, viewsCount: parseInt(e.target.value) || 0 })} className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-foreground/20" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingPost(null)} className="px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-foreground/5">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl font-medium text-sm bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 flex items-center gap-2">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sync Prompt Modal */}
      {syncPrompt?.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-foreground/10">
            <div className="px-6 py-4 border-b border-foreground/10 flex justify-between items-center bg-foreground/[0.02]">
              <h3 className="font-serif text-lg font-bold">Sync {syncPrompt.type === 'profile' ? 'Profile' : 'Posts'}</h3>
              <button onClick={() => setSyncPrompt(null)} className="text-foreground/50 hover:text-foreground">
                <XIcon size={20} />
              </button>
            </div>
            <form onSubmit={executeSync} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Instagram Username</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={syncPrompt.username}
                  onChange={e => setSyncPrompt({ ...syncPrompt, username: e.target.value })}
                  className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-foreground/20"
                />
                <p className="text-xs text-foreground/50 mt-2">The scraper will pull data for this username in the background.</p>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setSyncPrompt(null)} className="px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-foreground/5">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-medium text-sm bg-foreground text-background hover:bg-foreground/90">
                  Start Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Hide Modal */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-foreground/10">
            <div className="px-6 py-4 border-b border-foreground/10 flex justify-between items-center bg-foreground/[0.02]">
              <h3 className="font-serif text-lg font-bold text-red-500 flex items-center gap-2"><EyeOff size={18} /> Hide Post</h3>
              <button onClick={() => setConfirmModal(null)} className="text-foreground/50 hover:text-foreground">
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-foreground/80">Are you sure you want to hide this post from the public view? You can still sync it later if you change your mind.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 text-sm font-medium hover:bg-foreground/5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeHidePost}
                  className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-background border border-foreground/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-2">Delete {deleteConfirmModal.type === 'profile' ? 'Profile' : 'Post'}</h3>
            <p className="text-foreground/70 text-sm mb-6">
              Are you sure you want to permanently delete this {deleteConfirmModal.type}? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmModal(null)}
                className="px-4 py-2 text-sm font-medium hover:bg-foreground/5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteConfirmModal.type === 'profile' ? handleDeleteProfile : handleDeletePost}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
