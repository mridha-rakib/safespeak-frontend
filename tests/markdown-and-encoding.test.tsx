import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  AssistantMessageRenderer,
  normalizeAssistantMarkdown,
} from "../src/components/chat/assistant-message-renderer";
import {
  classifyTimelineAssistantTurnKind,
  shouldCallTimelineAssistant,
} from "../src/lib/assistant-conversation";
import {
  buildConversationRequestBody,
  buildUtf8JsonHeaders,
  hasBrokenTextEncoding,
  normalizeJsonEncoding,
  repairBrokenTextEncoding,
} from "../src/lib/text-encoding";

test("frontend conversation payload preserves exact bengali text", () => {
  const content =
    "আমার বস আমার উচ্চারণ নিয়ে হাসাহাসি করে এবং বলে আমি এখানে মানাই না।";
  const payload = buildConversationRequestBody({
    content,
    language: "bn",
  });

  assert.equal(payload, JSON.stringify({ content, language: "bn" }));
  assert.equal(JSON.parse(payload).content, content);
  assert.equal(hasBrokenTextEncoding(content), false);
});

test("frontend mojibake guard catches broken multilingual text", () => {
  assert.equal(hasBrokenTextEncoding("αªåαª«αª╛"), true);
  assert.equal(hasBrokenTextEncoding("à¦à¦®à¦¾à¦°"), true);
  assert.equal(hasBrokenTextEncoding("hello"), false);
});

test("frontend mojibake repair restores smart punctuation", () => {
  assert.equal(
    repairBrokenTextEncoding(
      "Hi there. IΓÇÖm here with you. What would you like help with todayΓÇöjust a chat?"
    ),
    "Hi there. I’m here with you. What would you like help with today—just a chat?"
  );
});

test("frontend json encoding normalization repairs nested api payload strings", () => {
  const normalized = normalizeJsonEncoding({
    data: {
      assistantMessage: {
        content: "IΓÇÖm here with you.",
      },
      messages: ["Hello", "What would you like help with todayΓÇöjust a chat?"],
    },
  });

  assert.equal(normalized.data.assistantMessage.content, "I’m here with you.");
  assert.equal(
    normalized.data.messages[1],
    "What would you like help with today—just a chat?"
  );
});

test("frontend utf8 headers include charset", () => {
  const headers = buildUtf8JsonHeaders();

  assert.equal(headers.get("Content-Type"), "application/json; charset=utf-8");
  assert.equal(headers.get("Accept"), "application/json; charset=utf-8");
});

test("assistant markdown renderer outputs semantic bold and list markup", () => {
  const html = renderToStaticMarkup(
    <AssistantMessageRenderer
      content={"**Important**\n\n- one\n- two"}
    />
  );

  assert.match(html, /<strong>Important<\/strong>/);
  assert.match(html, /<ul>/);
  assert.match(html, /<li>one<\/li>/);
  assert.doesNotMatch(html, /\*\*Important\*\*/);
});

test("assistant markdown normalization preserves paragraph spacing", () => {
  assert.equal(
    normalizeAssistantMarkdown("Line one\n\n\nLine two  \n"),
    "Line one\n\nLine two"
  );
});

test("timeline assistant route guard skips format preference questions and sets", () => {
  assert.equal(
    classifyTimelineAssistantTurnKind(
      "are you answering with bullet points every time?"
    ),
    "format_preference_question"
  );
  assert.equal(
    shouldCallTimelineAssistant({
      message: "please answer in paragraphs, not bullet points",
      conversation: [
        { role: "user", content: "Someone hit me outside work." },
      ],
      timeline: { what: "Someone hit me" },
      incidentCategory: "racial_abuse",
    }),
    false
  );
});

test("timeline assistant route guard allows incident detail follow-up with active incident", () => {
  assert.equal(
    shouldCallTimelineAssistant({
      message: "I have screenshots from Facebook.",
      conversation: [
        { role: "user", content: "Someone sent me death threats on Facebook." },
      ],
      timeline: { what: "Someone sent me death threats" },
      incidentCategory: "cyber_scam",
    }),
    true
  );
});
