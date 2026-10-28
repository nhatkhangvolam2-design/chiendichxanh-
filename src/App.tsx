import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { RegistrationSection } from './components/RegistrationSection';
import { BulletinSection } from './components/BulletinSection';
import { ActivityPostsSection } from './components/ActivityPostsSection';
import { ParticipantsModal } from './components/ParticipantsModal';
import { NewAnnouncementModal } from './components/NewAnnouncementModal';
import { NewPostModal } from './components/NewPostModal';
import { EditStatsModal } from './components/EditStatsModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AiToolkitModal } from './components/AiToolkitModal';
import { Footer } from './components/Footer';

import { VolunteerParticipant, AnnouncementItem, ActivityPost, CampaignStats } from './types';
import { INITIAL_PARTICIPANTS, INITIAL_ANNOUNCEMENTS, INITIAL_POSTS, INITIAL_STATS } from './data/initialData';

export default function App() {
  // Admin Mode state:
  // Visitors accessing via shared link start in read-only mode (isAdmin = false).
  // Admin can unlock via password or url parameter (?admin=true).
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true') {
        localStorage.setItem('thx_is_admin', 'true');
        return true;
      }
      return localStorage.getItem('thx_is_admin') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Campaign Stats state (Admin editable)
  // Campaign Stats state (Admin editable)
  const [stats, setStats] = useState<CampaignStats>(() => {
    try {
      const saved = localStorage.getItem('thx_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.wasteCollected === '340+ kg') parsed.wasteCollected = '0 kg';
        if (parsed.roadCleaned === '2.5 km') parsed.roadCleaned = '0 km';
        if (parsed.campaignsCompleted === '06 buổi') parsed.campaignsCompleted = '0 buổi';
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read stats from localStorage');
    }
    return INITIAL_STATS;
  });

  // Participants state (Clean list, stripped of any legacy fake volunteers)
  const [participants, setParticipants] = useState<VolunteerParticipant[]>(() => {
    try {
      const saved = localStorage.getItem('thx_participants');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: any) => !p.id.startsWith('vol-00'));
        }
      }
    } catch (e) {
      console.warn('Could not read participants from localStorage');
    }
    return INITIAL_PARTICIPANTS;
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    try {
      const saved = localStorage.getItem('thx_announcements');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read announcements from localStorage');
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Activity Posts state - cleared of old sample posts as requested by user
  const [posts, setPosts] = useState<ActivityPost[]>(() => {
    try {
      const saved = localStorage.getItem('thx_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        const filtered = Array.isArray(parsed)
          ? parsed.filter((p: any) => !['post-001', 'post-002', 'post-003'].includes(p.id))
          : [];
        return filtered;
      }
    } catch (e) {
      console.warn('Could not read posts from localStorage');
    }
    return INITIAL_POSTS;
  });

  // Modal states
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [isNewAnnouncementModalOpen, setIsNewAnnouncementModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isEditStatsModalOpen, setIsEditStatsModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAiToolkitOpen, setIsAiToolkitOpen] = useState(false);

  // Sync with backend API on mount + live polling every 2.5s for real-time multi-user updates
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        const [statsRes, partRes, annRes, postsRes] = await Promise.all([
          fetch('/api/stats').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/participants').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/announcements').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/posts').then((r) => (r.ok ? r.json() : null)),
        ]);

        if (!isMounted) return;

        if (statsRes) {
          const waste = statsRes.wasteCollected === '340+ kg' ? '0 kg' : statsRes.wasteCollected;
          const road = statsRes.roadCleaned === '2.5 km' ? '0 km' : statsRes.roadCleaned;
          const camps = statsRes.campaignsCompleted === '06 buổi' ? '0 buổi' : statsRes.campaignsCompleted;

          setStats((prev) => ({
            ...prev,
            volunteerCountMode: statsRes.volunteerCountMode || prev.volunteerCountMode,
            customVolunteerCount: statsRes.customVolunteerCount ?? prev.customVolunteerCount,
            wasteCollected: waste || prev.wasteCollected || '0 kg',
            roadCleaned: road || prev.roadCleaned || '0 km',
            campaignsCompleted: camps || prev.campaignsCompleted || '0 buổi',
          }));
        }

        if (partRes && Array.isArray(partRes.participants)) {
          // Direct replacement! Server is single source of truth, but sanitize against legacy fake IDs
          const safeParticipants = partRes.participants.filter(
            (p: any) => !p.id.startsWith('vol-00')
          );
          setParticipants(safeParticipants);
        }

        if (annRes && Array.isArray(annRes)) {
          setAnnouncements(annRes);
        }

        if (postsRes && Array.isArray(postsRes)) {
          const filtered = postsRes.filter((p: any) => !['post-001', 'post-002', 'post-003'].includes(p.id));
          setPosts(filtered);
        }
      } catch (err) {
        // Silently handle transient network errors during background polling
      }
    };

    // First initial fetch
    fetchAllData();

    // Polling every 2500ms so when another person registers or admin deletes, all clients update immediately
    const pollTimer = setInterval(fetchAllData, 2500);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
    };
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('thx_stats', JSON.stringify(stats));
    } catch (e) {}
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem('thx_participants', JSON.stringify(participants));
    } catch (e) {}
  }, [participants]);

  useEffect(() => {
    try {
      localStorage.setItem('thx_announcements', JSON.stringify(announcements));
    } catch (e) {}
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('thx_posts', JSON.stringify(posts));
    } catch (e) {}
  }, [posts]);

  // Admin authentication handlers
  const handleLoginAdminSuccess = () => {
    setIsAdmin(true);
    try {
      localStorage.setItem('thx_is_admin', 'true');
    } catch (e) {}
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('thx_is_admin');
    } catch (e) {}
  };

  // Handlers
  const handleUpdateStats = async (newStats: CampaignStats) => {
    setStats(newStats);
    try {
      const res = await fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStats),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats((prev) => ({ ...prev, ...data.stats }));
        }
      }
    } catch (err) {
      console.warn('Could not persist stats to server, saved locally.');
    }
  };

  const handleRegisterSuccess = async (newParticipant: VolunteerParticipant) => {
    // Optimistic UI update
    setParticipants((prev) => {
      if (prev.some((p) => p.id === newParticipant.id)) return prev;
      return [newParticipant, ...prev];
    });

    // Re-sync with server state to get authoritative count and list
    try {
      const [partRes, statsRes] = await Promise.all([
        fetch('/api/participants').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/stats').then((r) => (r.ok ? r.json() : null)),
      ]);
      if (partRes && Array.isArray(partRes.participants)) {
        setParticipants(partRes.participants);
      }
      if (statsRes) {
        setStats((prev) => ({
          ...prev,
          customVolunteerCount: statsRes.customVolunteerCount ?? prev.customVolunteerCount,
        }));
      }
    } catch (e) {}
  };

  const handleDeleteParticipant = async (id: string) => {
    // 1. Optimistic removal from UI immediately
    setParticipants((prev) => prev.filter((p) => p.id !== id));

    // 2. Persist deletion on server and update state from server response
    try {
      const res = await fetch(`/api/participants/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.participants && Array.isArray(data.participants)) {
          setParticipants(data.participants);
        }
      }
      // Sync stats counter
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats((prev) => ({
          ...prev,
          customVolunteerCount: statsData.customVolunteerCount ?? prev.customVolunteerCount,
        }));
      }
    } catch (err) {
      console.warn('Could not delete participant from server, removed locally.');
    }
  };

  const handleAddAnnouncement = async (newAnn: AnnouncementItem) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
    try {
      await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnn),
      });
    } catch (err) {
      console.warn('Could not persist announcement to server, saved locally.');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    // Optimistically update UI
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    try {
      await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Could not delete announcement on server, removed locally.');
    }
  };

  const handleAddPost = async (newPost: ActivityPost) => {
    setPosts((prev) => [newPost, ...prev]);
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
    } catch (err) {
      console.warn('Could not persist post to server, saved locally.');
    }
  };

  const handleDeletePost = async (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Could not delete post on server, removed locally.');
    }
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 3-Zone Contract Header */}
      <Header
        participantCount={
          stats.volunteerCountMode === 'custom'
            ? stats.customVolunteerCount
            : participants.length
        }
        isAdmin={isAdmin}
        onOpenParticipants={() => setIsParticipantsModalOpen(true)}
        onOpenAiToolkit={() => setIsAiToolkitOpen(true)}
        onScrollTo={handleScrollTo}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Admin-gated editable KPI Strip */}
        <HeroSection
          participantCount={participants.length}
          stats={stats}
          isAdmin={isAdmin}
          onScrollTo={handleScrollTo}
          onOpenParticipants={() => setIsParticipantsModalOpen(true)}
          onOpenAiToolkit={() => setIsAiToolkitOpen(true)}
          onOpenEditStats={() => setIsEditStatsModalOpen(true)}
        />

        {/* Quick Registration Form */}
        <RegistrationSection
          participantCount={
            stats.volunteerCountMode === 'custom'
              ? stats.customVolunteerCount
              : participants.length
          }
          onRegisterSuccess={handleRegisterSuccess}
          onOpenParticipants={() => setIsParticipantsModalOpen(true)}
        />

        {/* Bulletin Board & Detailed Cleanup Schedule (Admin can add & delete) */}
        <BulletinSection
          announcements={announcements}
          isAdmin={isAdmin}
          onOpenNewAnnouncementModal={() => setIsNewAnnouncementModalOpen(true)}
          onOpenAiToolkit={() => setIsAiToolkitOpen(true)}
          onDeleteAnnouncement={handleDeleteAnnouncement}
        />

        {/* Meaningful Past Volunteer Activities & Articles (Admin can add/delete) */}
        <ActivityPostsSection
          posts={posts}
          isAdmin={isAdmin}
          onOpenNewPostModal={() => setIsNewPostModalOpen(true)}
          onDeletePost={handleDeletePost}
        />
      </main>

      {/* Modals */}
      <ParticipantsModal
        isOpen={isParticipantsModalOpen}
        isAdmin={isAdmin}
        onClose={() => setIsParticipantsModalOpen(false)}
        participants={participants}
        onOpenRegister={() => handleScrollTo('register')}
        onDeleteParticipant={handleDeleteParticipant}
      />

      {isAdmin && (
        <NewAnnouncementModal
          isOpen={isNewAnnouncementModalOpen}
          onClose={() => setIsNewAnnouncementModalOpen(false)}
          onAddAnnouncement={handleAddAnnouncement}
        />
      )}

      {isAdmin && (
        <NewPostModal
          isOpen={isNewPostModalOpen}
          onClose={() => setIsNewPostModalOpen(false)}
          onAddPost={handleAddPost}
        />
      )}

      {isAdmin && (
        <EditStatsModal
          isOpen={isEditStatsModalOpen}
          onClose={() => setIsEditStatsModalOpen(false)}
          stats={stats}
          actualParticipantCount={participants.length}
          onUpdateStats={handleUpdateStats}
        />
      )}

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleLoginAdminSuccess}
      />

      <AiToolkitModal
        isOpen={isAiToolkitOpen}
        onClose={() => setIsAiToolkitOpen(false)}
      />

      {/* Quiet Footer */}
      <Footer
        onScrollTo={handleScrollTo}
        onOpenParticipants={() => setIsParticipantsModalOpen(true)}
        onOpenAiToolkit={() => setIsAiToolkitOpen(true)}
      />
    </div>
  );
}
