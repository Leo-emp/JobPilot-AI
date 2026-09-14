/* ============================================================
   ADMIN BLOG MANAGER — /dashboard/admin/blog
   ============================================================
   List all blog posts, create new ones, edit existing ones.
   Supports draft/published/archived status.
   Markdown content with live preview.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* # Post shape from the API */
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  tags?: string | null;
  readTime: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

/* # Form state for creating/editing a post */
interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  readTime: string;
  status: string;
}

const EMPTY_FORM: PostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Career Tips",
  tags: "",
  readTime: "3 min read",
  status: "draft",
};

/* # Common blog categories */
const CATEGORIES = [
  "Career Tips",
  "Resume Tips",
  "Interview Prep",
  "Job Search",
  "Cover Letters",
  "LinkedIn",
  "Remote Work",
  "AI Tools",
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* # Editor state */
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PostForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  /* # Fetch all posts on mount */
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      setPosts(data.posts);
    } catch {
      setError("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  /* # Auto-generate slug from title */
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  /* # Open editor for new post */
  const handleNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setEditing(true);
    setMessage("");
  };

  /* # Open editor for existing post */
  const handleEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog/${id}`);
      if (!res.ok) throw new Error("Failed to load post");
      const data = await res.json();
      const p = data.post;
      setForm({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content || "",
        category: p.category,
        tags: p.tags || "",
        readTime: p.readTime,
        status: p.status,
      });
      setEditingId(id);
      setEditing(true);
      setMessage("");
    } catch {
      setError("Failed to load post for editing");
    }
  };

  /* # Save (create or update) */
  const handleSave = async () => {
    if (!form.title || !form.slug || !form.excerpt || !form.content) {
      setMessage("Fill in title, slug, excerpt, and content");
      return;
    }
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/admin/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to save");
        return;
      }

      setMessage(editingId ? "Post updated!" : "Post created!");
      setEditing(false);
      fetchPosts();
    } catch {
      setMessage("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  /* # Delete a post */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMessage("Post deleted");
      fetchPosts();
    } catch {
      setMessage("Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  /* # Status badge colors */
  const statusColor = (s: string) => {
    if (s === "published") return "bg-green-500/15 text-green-400 border-green-500/20";
    if (s === "archived") return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20";
    return "bg-space-600 text-text-muted border-card-border/50";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* # ---- EDITOR VIEW ---- */
  if (editing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* # Header with back + save buttons */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setEditing(false)}
            className="text-sm text-text-muted hover:text-white transition-colors"
          >
            ← Back to posts
          </button>
          <div className="flex items-center gap-3">
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="px-3 py-1.5 rounded-lg text-sm bg-space-700 border border-card-border/50 text-white focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary px-5 py-2 text-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-brand-indigo/10 border border-brand-indigo/20 text-sm text-brand-indigo">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {/* # Title */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => {
                const title = e.target.value;
                setForm({
                  ...form,
                  title,
                  /* # Auto-slug only for new posts */
                  slug: editingId ? form.slug : slugify(title),
                });
              }}
              placeholder="How to Beat ATS Systems in 2026"
              className="w-full px-3 py-2.5 rounded-lg bg-space-700 border border-card-border/50 text-white placeholder:text-text-muted/40 focus:outline-none focus:border-brand-indigo/50"
            />
          </div>

          {/* # Slug */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">URL Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted">jobpilotai.co/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                className="flex-1 px-3 py-2.5 rounded-lg bg-space-700 border border-card-border/50 text-white focus:outline-none focus:border-brand-indigo/50"
              />
            </div>
          </div>

          {/* # Excerpt */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Excerpt (shown on blog cards)</label>
            <textarea
              value={form.excerpt}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              placeholder="A short description of the article (~30 words)"
              className="w-full px-3 py-2.5 rounded-lg bg-space-700 border border-card-border/50 text-white placeholder:text-text-muted/40 focus:outline-none focus:border-brand-indigo/50 resize-none"
            />
          </div>

          {/* # Category + Read Time row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-space-700 border border-card-border/50 text-white focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Read Time</label>
              <input
                type="text"
                value={form.readTime}
                onChange={e => setForm({ ...form, readTime: e.target.value })}
                placeholder="3 min read"
                className="w-full px-3 py-2.5 rounded-lg bg-space-700 border border-card-border/50 text-white focus:outline-none focus:border-brand-indigo/50"
              />
            </div>
          </div>

          {/* # Tags */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Tags (comma-separated, optional)</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="ATS, resume, job search"
              className="w-full px-3 py-2.5 rounded-lg bg-space-700 border border-card-border/50 text-white placeholder:text-text-muted/40 focus:outline-none focus:border-brand-indigo/50"
            />
          </div>

          {/* # Content (markdown) */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Content (Markdown)</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={20}
              placeholder="Write your blog post in Markdown..."
              className="w-full px-3 py-2.5 rounded-lg bg-space-700 border border-card-border/50 text-white placeholder:text-text-muted/40 focus:outline-none focus:border-brand-indigo/50 resize-y font-mono text-sm leading-relaxed"
            />
          </div>
        </div>
      </div>
    );
  }

  /* # ---- LIST VIEW ---- */
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* # Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Manager</h1>
          <p className="text-sm text-text-muted mt-1">{posts.length} posts</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin" className="text-sm text-text-muted hover:text-white transition-colors">
            ← Admin
          </Link>
          <button onClick={handleNew} className="btn-primary px-4 py-2 text-sm">
            + New Post
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-brand-indigo/10 border border-brand-indigo/20 text-sm text-brand-indigo">
          {message}
        </div>
      )}

      {/* # Posts list */}
      <div className="rounded-xl border border-card-border bg-space-800/60 overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            No posts yet. Click &quot;+ New Post&quot; to create one.
          </div>
        ) : (
          <div className="divide-y divide-card-border">
            {posts.map(post => (
              <div key={post.id} className="p-4 flex items-center justify-between hover:bg-space-700/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">{post.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                    <span>·</span>
                    <span>/blog/{post.slug}</span>
                    {post.publishedAt && (
                      <>
                        <span>·</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-space-600 border border-card-border/50 text-text-muted hover:text-white transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleEdit(post.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-space-600 border border-card-border/50 text-white hover:bg-space-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    {deleting === post.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
