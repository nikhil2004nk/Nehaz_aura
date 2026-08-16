"use client";

import React, { useState, useEffect } from "react";
import { environment } from "../../../config/environment";
import { motion } from "framer-motion";
import { Loader2, Plus, Edit2, Trash2, Check, X, Image as ImageIcon } from "lucide-react";
import { authFetch } from "@/utils/authFetch";

interface Teacher {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  instagramUrl: string;
  order: number;
  isPublicVisible: boolean;
}

export default function TeachersAdminPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Partial<Teacher> | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch(`${environment.apiUrl}/teachers`);
      if (res.ok) {
        const { data } = await res.json();
        setTeachers(data);
      }
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    
    setIsSaving(true);
    setMessage(null);
    try {
      const isNew = !editingTeacher.id;
      const url = isNew 
        ? `${environment.apiUrl}/teachers` 
        : `${environment.apiUrl}/teachers/${editingTeacher.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTeacher),
      });

      if (!res.ok) throw new Error("Failed to save teacher");

      setMessage({ type: 'success', text: `Teacher ${isNew ? 'added' : 'updated'} successfully.` });
      setEditingTeacher(null);
      fetchTeachers();
    } catch (error) {
      setMessage({ type: 'error', text: "An error occurred while saving." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    try {
      const res = await authFetch(`${environment.apiUrl}/teachers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage({ type: 'success', text: "Teacher deleted successfully." });
        setDeleteConfirmModal(null);
        fetchTeachers();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      setMessage({ type: 'error', text: "An error occurred while deleting." });
    }
  };

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const res = await authFetch(`${environment.apiUrl}/teachers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublicVisible: !currentVisibility }),
      });
      if (res.ok) fetchTeachers();
    } catch (error) {
      console.error("Failed to toggle visibility", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground/40">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-sm tracking-widest uppercase">Loading teachers...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-foreground tracking-tight mb-1">
              Teacher Management
            </h2>
            <p className="text-xs text-foreground/50 uppercase tracking-widest font-medium">
              Manage team members for the public site
            </p>
          </div>
          <button
            onClick={() => setEditingTeacher({ name: '', role: '', bio: '', imageUrl: '', instagramUrl: '', isPublicVisible: true, order: 0 })}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={14} /> Add Teacher
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm mb-6 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {teachers.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-2xl border border-foreground/5">
          <p className="text-foreground/40 font-medium">No teachers added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map(teacher => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={teacher.id}
              className="bg-background border border-foreground/5 rounded-3xl p-6 shadow-sm relative group overflow-hidden"
            >
              <div className="flex gap-4 items-start mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-foreground/5 shrink-0 border border-foreground/10">
                  {teacher.imageUrl ? (
                    <img src={teacher.imageUrl} alt={teacher.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/20">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg truncate">{teacher.name}</h3>
                  <p className="text-xs text-foreground/50 uppercase tracking-wider font-medium truncate">{teacher.role}</p>
                </div>
              </div>
              <p className="text-sm text-foreground/70 line-clamp-3 mb-6">{teacher.bio}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <button
                  onClick={() => handleToggleVisibility(teacher.id, teacher.isPublicVisible)}
                  className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider transition-colors ${
                    teacher.isPublicVisible 
                      ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' 
                      : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'
                  }`}
                >
                  {teacher.isPublicVisible ? 'Visible' : 'Hidden'}
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingTeacher(teacher)}
                    className="p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/50 hover:text-foreground transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => setDeleteConfirmModal(teacher.id)}
                    className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
          <div className="bg-background border border-foreground/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-xl font-bold font-serif">{editingTeacher.id ? 'Edit Teacher' : 'Add New Teacher'}</h3>
              <button 
                onClick={() => setEditingTeacher(null)}
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar flex-1 -mx-2 px-2">
              <form id="teacherForm" onSubmit={handleSaveTeacher} className="space-y-4 pb-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Name</label>
                  <input required type="text" value={editingTeacher.name || ''} onChange={e => setEditingTeacher({...editingTeacher, name: e.target.value})} className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground/30 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Role/Title</label>
                  <input required type="text" value={editingTeacher.role || ''} onChange={e => setEditingTeacher({...editingTeacher, role: e.target.value})} className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground/30 transition-colors" placeholder="e.g. Lead Instructor" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Bio</label>
                  <textarea required rows={4} value={editingTeacher.bio || ''} onChange={e => setEditingTeacher({...editingTeacher, bio: e.target.value})} className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground/30 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Image URL</label>
                  <input type="url" value={editingTeacher.imageUrl || ''} onChange={e => setEditingTeacher({...editingTeacher, imageUrl: e.target.value})} className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground/30 transition-colors" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Instagram URL (Optional)</label>
                  <input type="url" value={editingTeacher.instagramUrl || ''} onChange={e => setEditingTeacher({...editingTeacher, instagramUrl: e.target.value})} className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-foreground/30 transition-colors" placeholder="https://instagram.com/..." />
                </div>
              </form>
            </div>

            <div className="pt-6 mt-2 shrink-0 border-t border-foreground/5 flex justify-end gap-3">
              <button type="button" onClick={() => setEditingTeacher(null)} className="px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-foreground/5 transition-colors">Cancel</button>
              <button form="teacherForm" type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-xl font-medium text-sm bg-foreground text-background hover:opacity-90 disabled:opacity-50 transition-opacity">
                {isSaving ? "Saving..." : "Save Teacher"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-background border border-foreground/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <h3 className="text-xl font-bold mb-2">Delete Teacher</h3>
            <p className="text-foreground/70 text-sm mb-6">Are you sure you want to permanently delete this teacher?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirmModal(null)} className="px-4 py-2 text-sm font-medium hover:bg-foreground/5 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => handleDeleteTeacher(deleteConfirmModal)} className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
