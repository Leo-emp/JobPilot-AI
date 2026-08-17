/* ============================================================
   EMPLOYER MESSAGES — Messaging inbox for employer dashboard
   ============================================================
   Lists all candidate conversations, sorted by recency.
   Click a thread to view messages and reply.
   ============================================================ */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

/* # Thread from the API */
interface Thread {
  id: string;
  candidateId: string;
  roleId: string | null;
  status: string;
  lastMessageAt: string | null;
  createdAt: string;
  candidate: {
    id: string;
    name: string;
    image: string | null;
  };
  messages: Array<{
    content: string;
    senderType: string;
    createdAt: string;
    readAt: string | null;
  }>;
}

/* # Individual message */
interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderType: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

export default function EmployerMessagesPage() {
  const params = useParams();
  const empId = params.empId as string;

  const [threads, setThreads] = useState<Thread[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  /* # Selected thread state */
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{ name: string; image: string | null } | null>(null);

  /* # Load inbox */
  useEffect(() => {
    fetch(`/api/employer/${empId}/messages`)
      .then((r) => r.json())
      .then((data) => {
        setThreads(data.threads || []);
        setUnreadCount(data.unreadCount || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [empId]);

  /* # Load thread messages */
  const openThread = useCallback(async (threadId: string) => {
    setSelectedThread(threadId);
    setThreadLoading(true);

    const thread = threads.find((t) => t.id === threadId);
    setSelectedCandidate(thread?.candidate ?? null);

    try {
      const res = await fetch(`/api/employer/${empId}/messages/${threadId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      /* # Ignore */
    } finally {
      setThreadLoading(false);
    }
  }, [empId, threads]);

  /* # Send a message */
  async function handleSend() {
    if (!newMessage.trim() || !selectedThread || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/employer/${empId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: selectedThread, content: newMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } catch {
      /* # Ignore */
    } finally {
      setSending(false);
    }
  }

  /* # Block a thread */
  async function handleBlock() {
    if (!selectedThread) return;
    if (!confirm("Block this conversation? The candidate won't be able to message you.")) return;

    try {
      await fetch(`/api/employer/${empId}/messages/${selectedThread}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "block" }),
      });
      setThreads((prev) => prev.filter((t) => t.id !== selectedThread));
      setSelectedThread(null);
      setMessages([]);
    } catch {
      /* # Ignore */
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="mt-1 text-sm text-slate-400">
          Conversations with candidates.{" "}
          {unreadCount > 0 && (
            <span className="text-indigo-400">{unreadCount} unread</span>
          )}
        </p>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-12 text-center">
          <p className="text-slate-400">No conversations yet.</p>
          <p className="mt-2 text-sm text-slate-500">
            Bookmark candidates to express interest. When both sides bookmark each other, messaging unlocks.
          </p>
        </div>
      ) : (
        <div className="flex gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 overflow-hidden" style={{ height: "calc(100vh - 280px)" }}>
          {/* # Thread list */}
          <div className="w-80 flex-shrink-0 border-r border-slate-700/50 overflow-y-auto">
            {threads.map((thread) => {
              const preview = thread.messages[0];
              const isUnread = preview && preview.senderType === "candidate" && !preview.readAt;
              const isSelected = selectedThread === thread.id;

              return (
                <button
                  key={thread.id}
                  onClick={() => openThread(thread.id)}
                  className={`w-full p-4 text-left border-b border-slate-700/30 transition hover:bg-slate-700/30 ${
                    isSelected ? "bg-slate-700/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isUnread && (
                      <div className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${isUnread ? "text-white" : "text-slate-300"}`}>
                        {thread.candidate.name}
                      </div>
                      {preview && (
                        <p className="mt-0.5 text-xs text-slate-500 truncate">
                          {preview.senderType === "employer" ? "You: " : ""}
                          {preview.content.substring(0, 60)}
                        </p>
                      )}
                    </div>
                    {thread.lastMessageAt && (
                      <span className="text-xs text-slate-600 flex-shrink-0">
                        {new Date(thread.lastMessageAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* # Message view */}
          <div className="flex-1 flex flex-col">
            {!selectedThread ? (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                Select a conversation to view messages
              </div>
            ) : threadLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
                  <div className="font-medium text-white">
                    {selectedCandidate?.name ?? "Candidate"}
                  </div>
                  <button
                    onClick={handleBlock}
                    className="text-xs text-slate-500 hover:text-red-400 transition"
                  >
                    Block
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-8">
                      No messages yet. Send the first message!
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderType === "employer" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                            msg.senderType === "employer"
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-700 text-slate-200"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <p className={`mt-1 text-xs ${
                            msg.senderType === "employer" ? "text-indigo-300" : "text-slate-500"
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-slate-700/50 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      maxLength={5000}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim() || sending}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? "..." : "Send"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
