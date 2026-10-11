
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { LeadRecord } from "@/lib/leads";
import { leadStatuses } from "@/lib/config";

type View = "loading" | "login" | "ready" | "disabled" | "error";

const statusStyles: Record<string, string> = {
  new: "border-accent-blue/40 bg-accent-blue/10 text-accent-blue",
  contacted: "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan",
  qualified: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  proposal: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  won: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  lost: "border-white/20 bg-white/5 text-slate-400",
};

export default function AdminPage() {
  const [view, setView] = useState<View>("loading");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads", {
        cache: "no-store",
      });

      if (res.status === 401) {
        setView("login");
        return;
      }

      if (res.status === 403) {
        setView("disabled");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load leads.");
      }

      const data = (await res.json()) as {
        leads?: LeadRecord[];
      };

      setLeads(data.leads ?? []);
      setView("ready");
    } catch {
      setView("error");
    }
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };

        setLoginError(data.error ?? "Login failed.");
        return;
      }

      setPassword("");
      await loadLeads();
    } catch {
      setLoginError("Network error. Please try again.");
    }
  }

  async function updateStatus(
    id: string,
    status: LeadRecord["status"]
  ) {
    if (updatingLeadId) return;

    const currentLead = leads.find((lead) => lead.id === id);

    if (!currentLead || currentLead.status === status) return;

    const previousStatus = currentLead.status;

    setNotice("");
    setUpdatingLeadId(id);

    // Optimistic update for a faster interface.
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status } : lead
      )
    );

    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };

        // Restore the previous status if the server rejects the update.
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === id
              ? { ...lead, status: previousStatus }
              : lead
          )
        );

        setNotice(data.error ?? "Could not save the status.");
        return;
      }

      setNotice("Lead status saved successfully.");
    } catch {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id
            ? { ...lead, status: previousStatus }
            : lead
        )
      );

      setNotice("Network error. The status could not be confirmed.");
    } finally {
      setUpdatingLeadId(null);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/login", {
        method: "DELETE",
      });
    } finally {
      setPassword("");
      setLeads([]);
      setView("login");
      setNotice("");
    }
  }

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        [
          lead.name,
          lead.business,
          lead.email,
          lead.phone,
          lead.industry,
          lead.city,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(q)
          );

      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, search]);

  if (view === "loading") {
    return (
      <div className="container-tight flex min-h-[60vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent-blue/30 border-t-accent-blue" />
      </div>
    );
  }

  if (view === "disabled") {
    return (
      <div className="container-tight flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
        <h1 className="font-display text-2xl font-semibold">
          Admin is not enabled
        </h1>

        <p className="mt-3 text-[15px] leading-relaxed text-slate-400">
          Set the{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-accent-cyan">
            ADMIN_PASSWORD
          </code>{" "}
          environment variable and a strong{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-accent-cyan">
            LEADS_SECRET
          </code>{" "}
          to activate the admin panel.
        </p>
      </div>
    );
  }

  if (view === "login") {
    return (
      <div className="container-tight flex min-h-[60vh] max-w-sm flex-col justify-center">
        <h1 className="font-display text-2xl font-semibold">
          Admin sign in
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Authorised team members only.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-password" className="field-label">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              autoComplete="current-password"
              required
            />
          </div>

          {loginError && (
            <p className="field-error" role="alert">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-gradient px-5 py-3 text-sm font-semibold text-navy-950 shadow-glow hover:brightness-110"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  if (view === "error") {
    return (
      <div className="container-tight flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-slate-400">
          Something went wrong loading the admin panel.
        </p>

        <button
          type="button"
          onClick={() => {
            setView("loading");
            void loadLeads();
          }}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const counts = leadStatuses.map((status) => ({
    status,
    count: leads.filter((lead) => lead.status === status).length,
  }));

  return (
    <div className="container-tight py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Leads</h1>
          <p className="mt-1 text-sm text-slate-500">
            {leads.length} total · private lead management
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadLeads()}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            Refresh
          </button>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>

      {notice && (
        <p
          role="status"
          aria-live="polite"
          className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
        >
          {notice}
        </p>
      )}

      {/* Pipeline summary */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {counts.map(({ status, count }) => (
          <button
            key={status}
            type="button"
            onClick={() =>
              setStatusFilter(
                statusFilter === status ? "all" : status
              )
            }
            className={`surface-card p-3.5 text-left transition-colors ${
              statusFilter === status
                ? "border-accent-cyan/40"
                : ""
            }`}
          >
            <p className="text-2xl font-bold text-white">{count}</p>

            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {status}
            </p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, business, email, city..."
          aria-label="Search leads"
          className="input-field sm:max-w-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="input-field sm:max-w-[200px]"
        >
          <option value="all" className="bg-navy-850">
            All statuses
          </option>

          {leadStatuses.map((status) => (
            <option
              key={status}
              value={status}
              className="bg-navy-850"
            >
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Lead list */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="surface-card p-8 text-center text-slate-400">
            No leads found. Form submissions will appear here.
          </p>
        ) : (
          filtered.map((lead) => (
            <div key={lead.id} className="surface-card overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setExpanded(
                    expanded === lead.id ? null : lead.id
                  )
                }
                className="flex w-full flex-wrap items-center gap-3 p-4 text-left hover:bg-white/[0.02]"
                aria-expanded={expanded === lead.id}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">
                    {lead.name} ·{" "}
                    <span className="font-normal text-slate-300">
                      {lead.business}
                    </span>
                  </p>

                  <p className="mt-0.5 truncate text-sm text-slate-500">
                    {lead.email} · {lead.phone}
                    {lead.city ? ` · ${lead.city}` : ""}
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                  {lead.type.replace("_", " ")}
                </span>

                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    statusStyles[lead.status] ?? statusStyles.new
                  }`}
                >
                  {lead.status}
                </span>

                <span className="text-xs text-slate-600">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </button>

              {expanded === lead.id && (
                <div className="border-t border-white/[0.06] p-5">
                  <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    {[
                      ["Email", lead.email],
                      ["Phone", lead.phone],
                      ["Industry", lead.industry],
                      ["City", lead.city],
                      ["Instagram", lead.instagram],
                      ["Preferred contact", lead.contactMethod],
                      ["Source", lead.source],
                      ["Landing page", lead.landingPage],
                      [
                        "UTM",
                        Object.keys(lead.utm ?? {}).length
                          ? JSON.stringify(lead.utm)
                          : "—",
                      ],
                      [
                        "Received",
                        new Date(lead.createdAt).toLocaleString(),
                      ],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {label}
                        </dt>

                        <dd className="mt-0.5 break-words text-slate-300">
                          {value ? String(value) : "—"}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {(lead.challenge || lead.message || lead.subject) && (
                    <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                      {lead.subject && (
                        <p className="text-sm text-slate-300">
                          <span className="font-semibold text-slate-400">
                            Subject:{" "}
                          </span>
                          {lead.subject}
                        </p>
                      )}

                      {lead.challenge && (
                        <p className="text-sm leading-relaxed text-slate-300">
                          <span className="font-semibold text-slate-400">
                            Challenge:{" "}
                          </span>
                          {lead.challenge}
                        </p>
                      )}

                      {lead.message && (
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-300">
                          {lead.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Set status:
                    </span>

                    {leadStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={updatingLeadId !== null}
                        onClick={() => void updateStatus(lead.id, status)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                          lead.status === status
                            ? statusStyles[status]
                            : "border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        {updatingLeadId === lead.id
                          ? "Saving..."
                          : status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
