export type messageSender = "human" | "ai";

export const modelTypes = [
  "gpt-3.5-turbo-1106",
  "gpt-4",
  "gpt-4-32k",
  "gpt-4-1106-preview",
] as const;

export type ModelType = (typeof modelTypes)[number];

export type Model = {
  key: ModelType;
  name: string;
};

export const models: Model[] = [
  { key: "gpt-3.5-turbo-1106", name: "GPT-3.5 Turbo" },
  { key: "gpt-4", name: "GPT-4" },
  { key: "gpt-4-32k", name: "GPT-4 32K" },
  { key: "gpt-4-1106-preview", name: "GPT-4 1106 Preview" },
];
