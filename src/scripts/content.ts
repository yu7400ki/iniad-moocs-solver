import { $object, $string, type Infer } from "lizod";
import type { ChatCompletion, ChatCompletionCreateParams } from "openai/resources/index.mjs";
import van from "vanjs-core";
import Settings from "../helpers/settings";

const { button } = van.tags;

const validate = $object({
  name: $string,
  answer: $string,
});

type Props = {
  problem: string;
};

const ignoreNamePattern = [/^network$/, /room$/, /seat$/];

const Solve = ({ problem }: Props) => {
  const loading = van.state(false);

  const insertAnswer = ({ name, answer }: Infer<typeof validate>, allowOverwrite: boolean) => {
    if (ignoreNamePattern.some((pattern) => pattern.test(name))) return;
    const selector = `[name="${name}"]`;
    const container = document.querySelector(`[data-problem="${problem}"]`);
    const element = container?.querySelector(selector);
    if (!element) return;
    if (element instanceof HTMLInputElement && ["text", "number"].includes(element.type)) {
      if (!allowOverwrite && element.value) return;
      element.value = answer;
    } else if (element instanceof HTMLSelectElement) {
      if (!allowOverwrite && element.value) return;
      element.value = answer;
    } else if (element instanceof HTMLTextAreaElement) {
      if (!allowOverwrite && element.value) return;
      element.value = answer;
    } else {
      return;
    }
  };

  const insertUserInstruction = (contents: Element) => {
    for (const element of contents.querySelectorAll(".form-control")) {
      if (ignoreNamePattern.some((pattern) => pattern.test(element.getAttribute("name") || ""))) continue;
      if (element instanceof HTMLInputElement && element.type === "text") {
        element.setAttribute("value", element.value);
      } else if (element instanceof HTMLTextAreaElement) {
        element.textContent = element.value;
      }
    }
  };

  const isElement = (element: unknown): element is Element => element instanceof Element;

  const handleClick = async () => {
    const { allowOverwrite, ...settings } = await Settings.get();
    const container = document.querySelector(`[data-problem="${problem}"]`);
    const contents = container?.querySelector(".problem-contents")?.cloneNode(true);
    if (!isElement(contents)) return;
    insertUserInstruction(contents);
    loading.val = true;
    try {
      const toolCalls = await fetchAnswer(contents.outerHTML, settings);
      if (!toolCalls) throw new Error("解答の生成に失敗しました。");
      for (const tool of toolCalls) {
        if (tool.function.name !== "insert_answer") continue;
        const args = JSON.parse(tool.function.arguments);
        if (!validate(args)) continue;
        insertAnswer(args, allowOverwrite);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        alert(error.message);
      }
    } finally {
      loading.val = false;
    }
  };

  return button(
    {
      class: "btn btn-primary",
      onclick: handleClick,
      disabled: loading,
    },
    "ChatGPT",
  );
};

const fetchAnswer = async (
  html: string,
  { apiKey, baseURL, model, instructions }: Omit<Settings, "allowOverwrite">,
) => {
  const user = `\`\`\`html\n${html}\n\`\`\``;

  const tool = {
    type: "function",
    function: {
      name: "insert_answer",
      description: "フォームフィールドに入力データを挿入する",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "入力データを挿入する要素の名前属性の値",
          },
          answer: {
            type: "string",
            description: "挿入する入力データ",
          },
        },
        required: ["name", "answer"],
      },
    },
  } as const;

  const body: ChatCompletionCreateParams = {
    model,
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: user },
    ],
    tools: [tool],
  };

  const url = new URL(`${baseURL}/chat/completions`);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error.message);
  }

  const json: ChatCompletion = await response.json();

  return json.choices[0].message.tool_calls;
};

const main = () => {
  const body = document.querySelector("body");

  if (!body) {
    throw new Error("body not found");
  }

  const problemContainer = document.querySelectorAll(".problem-container");

  for (const container of problemContainer) {
    const problem = container.getAttribute("data-problem");
    const target = container.querySelector(".problem-contentpage");
    if (!target || !problem) continue;
    van.add(target, Solve({ problem }));
  }
};

main();
