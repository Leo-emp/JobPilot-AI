import { describe, it, expect } from "vitest";
import { craftOutreach } from "@/lib/prompts/linkedin";

const BASE_PAYLOAD = {
  messageType: "cold_outreach",
  recipientName: "Sarah Johnson",
  recipientTitle: "Engineering Manager",
  recipientCompany: "Google",
  targetRole: "Senior Software Engineer",
  senderBackground: "5 years Python/React experience at Stripe, led team of 8, built ML pipeline processing 10M records/day. MS Computer Science from MIT.",
  context: "We both attended MIT and she posted about expanding her team",
  tone: "professional",
  platform: "LinkedIn",
};

describe("craftOutreach — field mapping", () => {
  it("includes recipientName", () => {
    const prompt = craftOutreach(BASE_PAYLOAD);
    expect(prompt).toContain("Sarah Johnson");
  });

  it("includes recipientTitle (not recipientRole)", () => {
    const prompt = craftOutreach(BASE_PAYLOAD);
    expect(prompt).toContain("Engineering Manager");
    expect(prompt).not.toContain("recipientRole");
  });

  it("includes recipientCompany", () => {
    const prompt = craftOutreach(BASE_PAYLOAD);
    expect(prompt).toContain("Google");
  });

  it("includes targetRole", () => {
    const prompt = craftOutreach(BASE_PAYLOAD);
    expect(prompt).toContain("Senior Software Engineer");
  });

  it("includes senderBackground (not resume)", () => {
    const prompt = craftOutreach(BASE_PAYLOAD);
    expect(prompt).toContain("5 years Python/React");
    expect(prompt).toContain("Stripe");
    expect(prompt).toContain("ML pipeline");
  });

  it("includes context (not purpose)", () => {
    const prompt = craftOutreach(BASE_PAYLOAD);
    expect(prompt).toContain("We both attended MIT");
    expect(prompt).toContain("expanding her team");
  });

  it("falls back gracefully when optional fields are empty", () => {
    const minimal = { messageType: "cold_outreach", targetRole: "Analyst", tone: "professional", platform: "LinkedIn" };
    const prompt = craftOutreach(minimal);
    expect(prompt).toContain("Unknown");
    expect(prompt).toContain("professional");
    expect(prompt).toContain("their company");
    expect(prompt).not.toContain("undefined");
  });
});

describe("craftOutreach — tone injection", () => {
  it("injects professional tone instructions", () => {
    const prompt = craftOutreach({ ...BASE_PAYLOAD, tone: "professional" });
    expect(prompt).toContain("TONE: Professional and polished");
  });

  it("injects friendly tone instructions", () => {
    const prompt = craftOutreach({ ...BASE_PAYLOAD, tone: "friendly" });
    expect(prompt).toContain("TONE: Friendly and warm");
  });

  it("injects confident tone instructions", () => {
    const prompt = craftOutreach({ ...BASE_PAYLOAD, tone: "confident" });
    expect(prompt).toContain("TONE: Confident and bold");
  });

  it("injects casual tone instructions", () => {
    const prompt = craftOutreach({ ...BASE_PAYLOAD, tone: "casual" });
    expect(prompt).toContain("TONE: Casual and relaxed");
  });

  it("all versions use the SAME tone (varies length not tone)", () => {
    const prompt = craftOutreach({ ...BASE_PAYLOAD, tone: "casual" });
    expect(prompt).toContain("ALL 3 versions must follow the casual tone");
  });
});

describe("craftOutreach — platform-specific formatting", () => {
  it("LinkedIn: includes LinkedIn platform rules", () => {
    const prompt = craftOutreach({ ...BASE_PAYLOAD, platform: "LinkedIn" });
    expect(prompt).toContain("PLATFORM: LinkedIn Message");
    expect(prompt).toContain("LinkedIn");
    expect(prompt).not.toContain("Subject:");
  });

  it("Email: requires subject line", () => {
    const prompt = craftOutreach({ ...BASE_PAYLOAD, platform: "Email" });
    expect(prompt).toContain("PLATFORM: Email");
    expect(prompt).toContain("MUST include a compelling subject line");
    expect(prompt).toContain("Subject:");
  });

  it("Email: prompt header says Email, not LinkedIn", () => {
    const prompt = craftOutreach({ ...BASE_PAYLOAD, platform: "Email" });
    expect(prompt).toMatch(/^Write 3 versions of a Email cold outreach message/);
  });

  it("Twitter: includes Twitter DM rules", () => {
    const prompt = craftOutreach({ ...BASE_PAYLOAD, platform: "Twitter" });
    expect(prompt).toContain("PLATFORM: X / Twitter DM");
    expect(prompt).toContain("under 280 characters");
  });

  it("Twitter: prompt header says X / Twitter", () => {
    const prompt = craftOutreach({ ...BASE_PAYLOAD, platform: "Twitter" });
    expect(prompt).toMatch(/^Write 3 versions of a Twitter cold outreach message/);
  });

  it("platform in header matches selection, not hardcoded LinkedIn", () => {
    for (const p of ["LinkedIn", "Email", "Twitter"]) {
      const prompt = craftOutreach({ ...BASE_PAYLOAD, platform: p });
      expect(prompt).toMatch(new RegExp(`^Write 3 versions of a ${p}`));
    }
  });
});

describe("craftOutreach — message types", () => {
  const types = [
    "connection_request",
    "cold_outreach",
    "recruiter_pitch",
    "follow_up",
    "thank_you",
    "referral_request",
    "informational_interview",
  ];

  for (const mt of types) {
    it(`includes rules for ${mt}`, () => {
      const prompt = craftOutreach({ ...BASE_PAYLOAD, messageType: mt });
      expect(prompt).toContain(mt.replace("_", " "));
      expect(prompt).toContain("Message type:");
    });
  }

  it("connection_request on LinkedIn enforces 300 char limit", () => {
    const prompt = craftOutreach({ ...BASE_PAYLOAD, messageType: "connection_request", platform: "LinkedIn" });
    expect(prompt).toContain("300 characters");
  });
});

describe("craftOutreach — no stale field references", () => {
  it("does not reference payload.resume", () => {
    const prompt = craftOutreach(BASE_PAYLOAD);
    expect(prompt).not.toContain("payload.resume");
  });

  it("does not reference payload.recipientRole", () => {
    const prompt = craftOutreach(BASE_PAYLOAD);
    expect(prompt).not.toContain("payload.recipientRole");
  });

  it("does not reference payload.purpose", () => {
    const prompt = craftOutreach(BASE_PAYLOAD);
    expect(prompt).not.toContain("payload.purpose");
  });

  it("does not reference payload.recipientLinkedin", () => {
    const prompt = craftOutreach(BASE_PAYLOAD);
    expect(prompt).not.toContain("payload.recipientLinkedin");
  });

  it("does not contain 'undefined' for any missing field", () => {
    const prompt = craftOutreach({ messageType: "cold_outreach", tone: "professional", platform: "LinkedIn" });
    expect(prompt).not.toContain("undefined");
  });
});

describe("craftOutreach — cross-combination coverage", () => {
  const tones = ["professional", "friendly", "confident", "casual"];
  const platforms = ["LinkedIn", "Email", "Twitter"];
  const types = ["connection_request", "cold_outreach", "recruiter_pitch", "follow_up", "thank_you", "referral_request", "informational_interview"];

  for (const tone of tones) {
    for (const platform of platforms) {
      it(`${tone} + ${platform}: includes both tone and platform instructions`, () => {
        const prompt = craftOutreach({ ...BASE_PAYLOAD, tone, platform });
        expect(prompt).toContain(`TONE:`);
        expect(prompt).toContain(`PLATFORM:`);
        expect(prompt).toContain(`ALL 3 versions must follow the ${tone} tone`);
        expect(prompt).toMatch(new RegExp(`^Write 3 versions of a ${platform}`));
      });
    }
  }

  for (const mt of types) {
    it(`${mt} + Email: has subject line in format`, () => {
      const prompt = craftOutreach({ ...BASE_PAYLOAD, messageType: mt, platform: "Email" });
      expect(prompt).toContain("Subject:");
    });
  }
});
