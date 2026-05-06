/* ============================================================
   NETWORKING CRM PAGE
   ============================================================
   Two tabs:
   1. Contacts — manage people in your professional network
      (recruiters, hiring managers, referrals, mentors)
   2. Companies — track target companies you're interested in
   Full CRUD with filters, search, and follow-up tracking.
   ============================================================ */

"use client";

import { useState, useEffect, useCallback } from "react";

/* ---- Contact type from database ---- */
interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  linkedinUrl: string | null;
  relationship: string;
  notes: string | null;
  lastContactedAt: string | null;
  nextFollowUp: string | null;
  createdAt: string;
}

/* ---- Company type from database ---- */
interface Company {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  location: string | null;
  size: string | null;
  notes: string | null;
  priority: string;
  status: string;
  createdAt: string;
}

/* ---- Relationship types for contacts ---- */
const RELATIONSHIPS = ["Connection", "Recruiter", "Hiring Manager", "Referral", "Mentor"];

/* ---- Relationship badge colors ---- */
const RELATIONSHIP_COLORS: Record<string, string> = {
  Connection: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Recruiter: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Hiring Manager": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Referral: "bg-green-500/15 text-green-400 border-green-500/30",
  Mentor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
};

/* ---- Company priority colors ---- */
const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-500/15 text-red-400 border-red-500/30",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Low: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

/* ---- Company status colors ---- */
const STATUS_COLORS: Record<string, string> = {
  Researching: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Applied: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Interviewing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Offer: "bg-green-500/15 text-green-400 border-green-500/30",
  Rejected: "bg-red-500/15 text-red-400 border-red-500/30",
};

/* ---- Company sizes ---- */
const COMPANY_SIZES = ["Startup", "Small", "Medium", "Large", "Enterprise"];

export default function NetworkPage() {
  /* ---- Tab state ---- */
  const [activeTab, setActiveTab] = useState<"contacts" | "companies">("contacts");

  /* ---- Contacts state ---- */
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactFilter, setContactFilter] = useState("All");
  const [contactSearch, setContactSearch] = useState("");

  /* ---- Contact form fields ---- */
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cCompany, setCCompany] = useState("");
  const [cRole, setCRole] = useState("");
  const [cLinkedin, setCLinkedin] = useState("");
  const [cRelationship, setCRelationship] = useState("Connection");
  const [cNotes, setCNotes] = useState("");
  const [cFollowUp, setCFollowUp] = useState("");

  /* ---- Companies state ---- */
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyFilter, setCompanyFilter] = useState("All");

  /* ---- Company form fields ---- */
  const [coName, setCoName] = useState("");
  const [coIndustry, setCoIndustry] = useState("");
  const [coWebsite, setCoWebsite] = useState("");
  const [coLocation, setCoLocation] = useState("");
  const [coSize, setCoSize] = useState("");
  const [coNotes, setCoNotes] = useState("");
  const [coPriority, setCoPriority] = useState("Medium");
  const [coStatus, setCoStatus] = useState("Researching");

  /* ============================================================
     FETCH DATA - Load contacts and companies from API
     ============================================================ */
  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch("/api/contacts");
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch {
      /* Silently fail */
    } finally {
      setContactsLoading(false);
    }
  }, []);

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch("/api/companies");
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      }
    } catch {
      /* Silently fail */
    } finally {
      setCompaniesLoading(false);
    }
  }, []);

  /* Load data on mount */
  useEffect(() => {
    fetchContacts();
    fetchCompanies();
  }, [fetchContacts, fetchCompanies]);

  /* ============================================================
     CONTACT CRUD OPERATIONS
     ============================================================ */

  /* ---- Reset contact form fields ---- */
  const resetContactForm = () => {
    setCName(""); setCEmail(""); setCPhone(""); setCCompany("");
    setCRole(""); setCLinkedin(""); setCRelationship("Connection");
    setCNotes(""); setCFollowUp("");
    setEditingContact(null);
    setShowContactForm(false);
  };

  /* ---- Open edit form with existing contact data ---- */
  const startEditContact = (contact: Contact) => {
    setCName(contact.name);
    setCEmail(contact.email || "");
    setCPhone(contact.phone || "");
    setCCompany(contact.company || "");
    setCRole(contact.role || "");
    setCLinkedin(contact.linkedinUrl || "");
    setCRelationship(contact.relationship);
    setCNotes(contact.notes || "");
    setCFollowUp(contact.nextFollowUp ? contact.nextFollowUp.split("T")[0] : "");
    setEditingContact(contact);
    setShowContactForm(true);
  };

  /* ---- Save contact (create or update) ---- */
  const handleSaveContact = async () => {
    if (!cName.trim()) return;

    const body = {
      name: cName, email: cEmail, phone: cPhone, company: cCompany,
      role: cRole, linkedinUrl: cLinkedin, relationship: cRelationship,
      notes: cNotes, nextFollowUp: cFollowUp || null,
    };

    if (editingContact) {
      /* Update existing contact */
      await fetch(`/api/contacts/${editingContact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      /* Create new contact */
      await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    resetContactForm();
    fetchContacts();
  };

  /* ---- Mark contact as "just contacted" ---- */
  const markContacted = async (id: string) => {
    await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastContactedAt: new Date().toISOString() }),
    });
    fetchContacts();
  };

  /* ---- Delete a contact ---- */
  const deleteContact = async (id: string) => {
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    fetchContacts();
  };

  /* ============================================================
     COMPANY CRUD OPERATIONS
     ============================================================ */

  /* ---- Reset company form fields ---- */
  const resetCompanyForm = () => {
    setCoName(""); setCoIndustry(""); setCoWebsite(""); setCoLocation("");
    setCoSize(""); setCoNotes(""); setCoPriority("Medium"); setCoStatus("Researching");
    setEditingCompany(null);
    setShowCompanyForm(false);
  };

  /* ---- Open edit form with existing company data ---- */
  const startEditCompany = (company: Company) => {
    setCoName(company.name);
    setCoIndustry(company.industry || "");
    setCoWebsite(company.website || "");
    setCoLocation(company.location || "");
    setCoSize(company.size || "");
    setCoNotes(company.notes || "");
    setCoPriority(company.priority);
    setCoStatus(company.status);
    setEditingCompany(company);
    setShowCompanyForm(true);
  };

  /* ---- Save company (create or update) ---- */
  const handleSaveCompany = async () => {
    if (!coName.trim()) return;

    const body = {
      name: coName, industry: coIndustry, website: coWebsite, location: coLocation,
      size: coSize, notes: coNotes, priority: coPriority, status: coStatus,
    };

    if (editingCompany) {
      await fetch(`/api/companies/${editingCompany.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    resetCompanyForm();
    fetchCompanies();
  };

  /* ---- Update company status inline ---- */
  const updateCompanyStatus = async (id: string, status: string) => {
    await fetch(`/api/companies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchCompanies();
  };

  /* ---- Delete a company ---- */
  const deleteCompany = async (id: string) => {
    await fetch(`/api/companies/${id}`, { method: "DELETE" });
    fetchCompanies();
  };

  /* ============================================================
     FILTERED DATA
     ============================================================ */

  /* Filter contacts by relationship type and search query */
  const filteredContacts = contacts.filter((c) => {
    const matchesFilter = contactFilter === "All" || c.relationship === contactFilter;
    const matchesSearch = !contactSearch ||
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      (c.company || "").toLowerCase().includes(contactSearch.toLowerCase()) ||
      (c.role || "").toLowerCase().includes(contactSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  /* Filter companies by status */
  const filteredCompanies = companies.filter((c) => {
    return companyFilter === "All" || c.status === companyFilter;
  });

  /* Count contacts needing follow-up (overdue) */
  const overdueFollowUps = contacts.filter(
    (c) => c.nextFollowUp && new Date(c.nextFollowUp) <= new Date()
  ).length;

  /* ---- Common input class ---- */
  const inputClass = "w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm";

  return (
    <div>
      {/* ---- Page Header ---- */}
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-2">
        Networking CRM
      </h1>
      <p className="text-text-secondary mb-6">
        Manage your professional network and target companies.
      </p>

      {/* ---- Stats Bar ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold">{contacts.length}</div>
          <div className="text-xs text-text-muted mt-1">Contacts</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold">{companies.length}</div>
          <div className="text-xs text-text-muted mt-1">Companies</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className={`text-2xl font-bold ${overdueFollowUps > 0 ? "text-amber-400" : ""}`}>
            {overdueFollowUps}
          </div>
          <div className="text-xs text-text-muted mt-1">Follow-ups Due</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold">
            {companies.filter((c) => c.priority === "High").length}
          </div>
          <div className="text-xs text-text-muted mt-1">High Priority</div>
        </div>
      </div>

      {/* ---- Tab Switcher ---- */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "contacts"
              ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
              : "text-text-secondary hover:text-white hover:bg-space-600"
          }`}
        >
          Contacts ({contacts.length})
        </button>
        <button
          onClick={() => setActiveTab("companies")}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === "companies"
              ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
              : "text-text-secondary hover:text-white hover:bg-space-600"
          }`}
        >
          Companies ({companies.length})
        </button>
      </div>

      {/* ============================================================
           CONTACTS TAB
           ============================================================ */}
      {activeTab === "contacts" && (
        <div>
          {/* ---- Toolbar: Filter + Search + Add ---- */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Relationship filter */}
            <div className="flex gap-2 flex-wrap flex-1">
              {["All", ...RELATIONSHIPS].map((rel) => (
                <button
                  key={rel}
                  onClick={() => setContactFilter(rel)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    contactFilter === rel
                      ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
                      : "text-text-muted hover:text-white hover:bg-space-600 border border-transparent"
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              placeholder="Search contacts..."
              className="px-4 py-2 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:border-brand-indigo text-sm w-full sm:w-48"
            />

            {/* Add button */}
            <button
              onClick={() => { resetContactForm(); setShowContactForm(true); }}
              className="btn-primary text-sm whitespace-nowrap"
            >
              + Add Contact
            </button>
          </div>

          {/* ---- Contact Form (Add / Edit) ---- */}
          {showContactForm && (
            <div className="glass-card p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">
                {editingContact ? "Edit Contact" : "New Contact"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Name *</label>
                  <input type="text" value={cName} onChange={(e) => setCName(e.target.value)} placeholder="John Smith" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Email</label>
                  <input type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="john@company.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Phone</label>
                  <input type="text" value={cPhone} onChange={(e) => setCPhone(e.target.value)} placeholder="+1 555-0123" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Company</label>
                  <input type="text" value={cCompany} onChange={(e) => setCCompany(e.target.value)} placeholder="Google" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Role / Title</label>
                  <input type="text" value={cRole} onChange={(e) => setCRole(e.target.value)} placeholder="Engineering Manager" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">LinkedIn URL</label>
                  <input type="url" value={cLinkedin} onChange={(e) => setCLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Relationship</label>
                  <select value={cRelationship} onChange={(e) => setCRelationship(e.target.value)} className={inputClass}>
                    {RELATIONSHIPS.map((r) => (
                      <option key={r} value={r} className="bg-space-800">{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Follow-up Date</label>
                  <input type="date" value={cFollowUp} onChange={(e) => setCFollowUp(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Notes</label>
                <textarea value={cNotes} onChange={(e) => setCNotes(e.target.value)} placeholder="How you met, conversation topics, action items..." rows={2} className={inputClass + " resize-none"} />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSaveContact} className="btn-primary text-sm">
                  {editingContact ? "Update Contact" : "Save Contact"}
                </button>
                <button onClick={resetContactForm} className="btn-secondary text-sm">Cancel</button>
              </div>
            </div>
          )}

          {/* ---- Contacts List ---- */}
          {contactsLoading ? (
            <div className="flex items-center gap-3 text-text-secondary py-8">
              <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading contacts...</span>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-4">👥</div>
              <p className="text-text-secondary">
                {contacts.length === 0
                  ? "No contacts yet. Start building your network!"
                  : "No contacts match your filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredContacts.map((contact) => {
                /* Check if follow-up is overdue */
                const isOverdue = contact.nextFollowUp && new Date(contact.nextFollowUp) <= new Date();

                return (
                  <div
                    key={contact.id}
                    className={`glass-card p-5 ${isOverdue ? "border-amber-500/30" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Contact info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-indigo to-brand-purple flex items-center justify-center text-sm font-bold text-white shrink-0">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-white truncate">{contact.name}</h3>
                            <p className="text-xs text-text-secondary truncate">
                              {[contact.role, contact.company].filter(Boolean).join(" at ") || "No company"}
                            </p>
                          </div>
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap gap-2 mt-3 ml-13">
                          {/* Relationship badge */}
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${RELATIONSHIP_COLORS[contact.relationship] || RELATIONSHIP_COLORS.Connection}`}>
                            {contact.relationship}
                          </span>

                          {/* Follow-up indicator */}
                          {contact.nextFollowUp && (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isOverdue
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                : "bg-space-600 text-text-muted"
                            }`}>
                              {isOverdue ? "Follow-up overdue" : `Follow up: ${new Date(contact.nextFollowUp).toLocaleDateString()}`}
                            </span>
                          )}

                          {/* Last contacted */}
                          {contact.lastContactedAt && (
                            <span className="px-2.5 py-0.5 rounded-full bg-space-600 text-text-muted text-xs">
                              Last contact: {new Date(contact.lastContactedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Notes preview */}
                        {contact.notes && (
                          <p className="text-xs text-text-muted mt-2 ml-13 line-clamp-1">{contact.notes}</p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* LinkedIn link */}
                        {contact.linkedinUrl && (
                          <a
                            href={contact.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-text-muted hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-all"
                            title="View LinkedIn"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                        )}

                        {/* Mark as contacted */}
                        <button
                          onClick={() => markContacted(contact.id)}
                          className="p-2 rounded-lg text-text-muted hover:text-green-400 hover:bg-green-500/10 transition-all"
                          title="Mark as contacted"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => startEditContact(contact)}
                          className="p-2 rounded-lg text-text-muted hover:text-brand-light hover:bg-brand-indigo/10 transition-all"
                          title="Edit contact"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete contact"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
           COMPANIES TAB
           ============================================================ */}
      {activeTab === "companies" && (
        <div>
          {/* ---- Toolbar: Filter + Add ---- */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Status filter */}
            <div className="flex gap-2 flex-wrap flex-1">
              {["All", "Researching", "Applied", "Interviewing", "Offer", "Rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setCompanyFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    companyFilter === s
                      ? "bg-brand-indigo/20 text-white border border-brand-indigo/30"
                      : "text-text-muted hover:text-white hover:bg-space-600 border border-transparent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Add button */}
            <button
              onClick={() => { resetCompanyForm(); setShowCompanyForm(true); }}
              className="btn-primary text-sm whitespace-nowrap"
            >
              + Add Company
            </button>
          </div>

          {/* ---- Company Form (Add / Edit) ---- */}
          {showCompanyForm && (
            <div className="glass-card p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">
                {editingCompany ? "Edit Company" : "New Target Company"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Company Name *</label>
                  <input type="text" value={coName} onChange={(e) => setCoName(e.target.value)} placeholder="Google" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Industry</label>
                  <input type="text" value={coIndustry} onChange={(e) => setCoIndustry(e.target.value)} placeholder="Technology" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Website</label>
                  <input type="url" value={coWebsite} onChange={(e) => setCoWebsite(e.target.value)} placeholder="https://google.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Location</label>
                  <input type="text" value={coLocation} onChange={(e) => setCoLocation(e.target.value)} placeholder="Mountain View, CA" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Company Size</label>
                  <select value={coSize} onChange={(e) => setCoSize(e.target.value)} className={inputClass}>
                    <option value="" className="bg-space-800">Select size</option>
                    {COMPANY_SIZES.map((s) => (
                      <option key={s} value={s} className="bg-space-800">{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Priority</label>
                  <select value={coPriority} onChange={(e) => setCoPriority(e.target.value)} className={inputClass}>
                    {["Low", "Medium", "High"].map((p) => (
                      <option key={p} value={p} className="bg-space-800">{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Research Notes</label>
                <textarea value={coNotes} onChange={(e) => setCoNotes(e.target.value)} placeholder="Company culture, team info, recent news, why you want to work here..." rows={2} className={inputClass + " resize-none"} />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSaveCompany} className="btn-primary text-sm">
                  {editingCompany ? "Update Company" : "Save Company"}
                </button>
                <button onClick={resetCompanyForm} className="btn-secondary text-sm">Cancel</button>
              </div>
            </div>
          )}

          {/* ---- Companies List ---- */}
          {companiesLoading ? (
            <div className="flex items-center gap-3 text-text-secondary py-8">
              <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading companies...</span>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <p className="text-text-secondary">
                {companies.length === 0
                  ? "No target companies yet. Start your research!"
                  : "No companies match your filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="glass-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Company info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {/* Company icon */}
                        <div className="w-10 h-10 rounded-xl bg-space-600 flex items-center justify-center text-lg shrink-0">
                          🏢
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-white truncate">{company.name}</h3>
                          <p className="text-xs text-text-secondary truncate">
                            {[company.industry, company.location].filter(Boolean).join(" · ") || "No details"}
                          </p>
                        </div>
                      </div>

                      {/* Metadata row */}
                      <div className="flex flex-wrap gap-2 mt-2 ml-13">
                        {/* Priority badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${PRIORITY_COLORS[company.priority] || PRIORITY_COLORS.Medium}`}>
                          {company.priority} Priority
                        </span>

                        {/* Size badge */}
                        {company.size && (
                          <span className="px-2.5 py-0.5 rounded-full bg-space-600 text-text-muted text-xs">
                            {company.size}
                          </span>
                        )}

                        {/* Website link */}
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-0.5 rounded-full bg-space-600 text-brand-light text-xs hover:text-white transition-colors"
                          >
                            Website &rarr;
                          </a>
                        )}
                      </div>

                      {/* Notes preview */}
                      {company.notes && (
                        <p className="text-xs text-text-muted mt-2 ml-13 line-clamp-2">{company.notes}</p>
                      )}
                    </div>

                    {/* Right side: Status + Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status dropdown */}
                      <select
                        value={company.status}
                        onChange={(e) => updateCompanyStatus(company.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${STATUS_COLORS[company.status] || STATUS_COLORS.Researching} bg-transparent cursor-pointer focus:outline-none`}
                      >
                        {["Researching", "Applied", "Interviewing", "Offer", "Rejected"].map((s) => (
                          <option key={s} value={s} className="bg-space-800">{s}</option>
                        ))}
                      </select>

                      {/* Edit */}
                      <button
                        onClick={() => startEditCompany(company)}
                        className="p-2 rounded-lg text-text-muted hover:text-brand-light hover:bg-brand-indigo/10 transition-all"
                        title="Edit company"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteCompany(company.id)}
                        className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete company"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
