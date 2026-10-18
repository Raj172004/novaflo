
"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteContent, ContentType } from "@/lib/content";

type ContentForm = {
  type: ContentType;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  body: string;
  published: boolean;
};

const emptyForm: ContentForm = {
  type: "service",
  slug: "",
  title: "",
  excerpt: "",
  category: "General",
  body: "",
  published: false,
};

export default function AdminContentPage() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [form, setForm] = useState<ContentForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState<"loading" | "ready" | "login" | "error">(
    "loading",
  );
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });

      if (response.status === 401) {
        setView("login");
        return;
      }

      if (!response.ok) throw new Error("Unable to load content.");

      const data = (await response.json()) as { content: SiteContent[] };
      setItems(data.content);
      setView("ready");
    } catch {
      setView("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setNotice("Sign-in failed. Check your password.");
        return;
      }

      setPassword("");
      await load();
    } catch {
      setNotice("Network error during sign-in.");
    }
  }

  function edit(item: SiteContent) {
    setEditingId(item.id);
    setForm({
      type: item.type,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      category: item.category || "General",
      body: item.body,
      published: item.published,
    });
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setNotice("");
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");

    try {
      const response = await fetch("/api/admin/content", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId ? { id: editingId, content: form } : form,
        ),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setNotice(result.error ?? "Unable to save content.");
        return;
      }

      setNotice(editingId ? "Content updated." : "Content created.");
      resetForm();
      await load();
    } catch {
      setNotice("Network error while saving content.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: SiteContent) {
    if (!window.confirm(`Delete "${item.title}" permanently?`)) return;

    setNotice("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setNotice(result.error ?? "Unable to delete content.");
        return;
      }

      if (editingId === item.id) resetForm();

      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setNotice("Content deleted.");
    } catch {
      setNotice("Network error while deleting content.");
    }
  }

  if (view === "loading") {
    return <main className="container-tight py-16">Loading content…</main>;
  }

  if (view === "login") {
    return (
      <main className="container-tight max-w-md py-16">
        <h1 className="font-display text-2xl font-bold">Content sign in</h1>
        <form onSubmit={login} className="mt-6 space-y-4">
          <label className="block text-sm" htmlFor="content-password">
            Admin password
          </label>
          <input
            id="content-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-field"
          />
          <button className="w-full rounded-xl bg-brand-gradient px-5 py-3 font-semibold text-navy-950">
            Sign in
          </button>
        </form>
        {notice && <p role="alert" className="mt-4 text-sm">{notice}</p>}
      </main>
    );
  }

  if (view === "error") {
    return (
      <main className="container-tight py-16">
        <p>Unable to load content.</p>
        <button className="mt-4 rounded-lg border px-4 py-2" onClick={() => {
          setView("loading");
          void load();
        }}>
          Retry
        </button>
      </main>
    );
  }

  return (
    <main className="container-tight py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Content management</h1>
          <p className="mt-2 text-sm text-slate-400">
            Create and manage services and insights stored in Firestore.
          </p>
        </div>
        <a className="rounded-lg border border-white/15 px-4 py-2 text-sm" href="/admin">
          Back to leads
        </a>
      </div>

      {notice && (
        <p role="status" aria-live="polite" className="mt-5 rounded-lg border border-white/10 p-3 text-sm">
          {notice}
        </p>
      )}

      <form onSubmit={save} className="surface-card mt-6 space-y-4 p-5">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit content" : "Create content"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Content type
            <select
              value={form.type}
              onChange={(event) => setForm({
                ...form,
                type: event.target.value as ContentType,
              })}
              className="input-field mt-2"
            >
              <option value="service">Service</option>
              <option value="insight">Insight / article</option>
            </select>
          </label>

          <label className="text-sm">
            URL slug
            <input
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              maxLength={120}
              placeholder="social-media-strategy"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
              className="input-field mt-2"
            />
          </label>
        </div>

        <label className="block text-sm">
          Title
          <input
            required
            maxLength={200}
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className="input-field mt-2"
          />
        </label>

        <label className="block text-sm">
          Summary
          <textarea
            maxLength={1000}
            rows={2}
            value={form.excerpt}
            onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
            className="input-field mt-2"
          />
        </label>

        {form.type === "insight" && (
          <label className="block text-sm">
            Category
            <input
              maxLength={80}
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              className="input-field mt-2"
              placeholder="Strategy, Content, Growth..."
            />
          </label>
        )}

        <label className="block text-sm">
          Body
          <textarea
            maxLength={30000}
            rows={8}
            value={form.body}
            onChange={(event) => setForm({ ...form, body: event.target.value })}
            className="input-field mt-2"
            placeholder="Enter content. Plain text is supported in this first version."
          />
        </label>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(event) => setForm({ ...form, published: event.target.checked })}
          />
          Published
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-brand-gradient px-5 py-3 font-semibold text-navy-950 disabled:opacity-50"
          >
            {busy ? "Saving…" : editingId ? "Save changes" : "Create content"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-xl border border-white/15 px-5 py-3">
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold">Saved content ({items.length})</h2>
        {items.length === 0 ? (
          <p className="surface-card p-6 text-sm text-slate-400">
            No CMS content yet. Create a draft above.
          </p>
        ) : items.map((item) => (
          <article key={item.id} className="surface-card flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-xs text-slate-400">
                {item.type} · /{item.slug}{item.type === "insight" ? ` · ${item.category || "General"}` : ""} · {item.published ? "Published" : "Draft"}
              </p>
            </div>
            <button type="button" onClick={() => edit(item)} className="rounded-lg border border-white/15 px-3 py-2 text-sm">
              Edit
            </button>
            <button type="button" onClick={() => void remove(item)} className="rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300">
              Delete
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
