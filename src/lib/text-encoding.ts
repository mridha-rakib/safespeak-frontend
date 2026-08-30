const MOJIBAKE_PATTERNS = [
  /αª/u,
  /à¦/u,
  /à§/u,
  /ΓÇ/u,
  /�{2,}/u,
];

const COMMON_MOJIBAKE_REPAIRS: Array<[RegExp, string]> = [
  [/ΓÇÖ/g, "’"],
  [/ΓÇ£/g, "“"],
  [/ΓÇ¥/g, "”"],
  [/ΓÇô/g, "–"],
  [/ΓÇö/g, "—"],
  [/â€™/g, "’"],
  [/â€œ/g, "“"],
  [/â€\x9D/g, "”"],
  [/â€“/g, "–"],
  [/â€”/g, "—"],
  [/â€˜/g, "‘"],
  [/â€¦/g, "…"],
];

export function hasBrokenTextEncoding(value: string): boolean {
  return MOJIBAKE_PATTERNS.some((pattern) => pattern.test(value));
}

export function repairBrokenTextEncoding(value: string): string {
  return COMMON_MOJIBAKE_REPAIRS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value
  );
}

export function normalizeJsonEncoding<T>(value: T): T {
  if (typeof value === "string") {
    return repairBrokenTextEncoding(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeJsonEncoding(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [
        key,
        normalizeJsonEncoding(entryValue),
      ])
    ) as T;
  }

  return value;
}

export function buildUtf8JsonHeaders(
  headers?: HeadersInit
): Headers {
  const normalizedHeaders = new Headers(headers);
  normalizedHeaders.set("Content-Type", "application/json; charset=utf-8");
  normalizedHeaders.set("Accept", "application/json; charset=utf-8");

  return normalizedHeaders;
}

export function buildConversationRequestBody(input: {
  content: string;
  language?: string;
}): string {
  return JSON.stringify({
    content: input.content,
    language: input.language,
  });
}
