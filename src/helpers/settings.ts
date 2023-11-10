import { $boolean, $object, $string, Infer } from "lizod";

const validate = $object({
  baseURL: $string,
  apiKey: $string,
  model: $string,
  instructions: $string,
  allowOverwrite: $boolean,
});

type Settings = Infer<typeof validate>;

export const fallback: Settings = {
  baseURL: "https://api.openai.com/v1",
  apiKey: "",
  model: "gpt-3.5-turbo-1106",
  instructions:
    "提供されたHTMLを解析し、フォームに必要な入力データを抽出した後、それらのデータを対応するフォームフィールドに自動的に挿入します。各フォームフィールドは、名前属性（`name`属性）によって一意に識別され、必要な入力データは各名前属性に対して一意です。複数の質問や問題が存在する場合を考慮する必要があります。",
  allowOverwrite: false,
};

const Settings = {
  get: async (): Promise<Settings> => {
    const savedSettings = await chrome.storage.local.get(fallback);
    if (!validate(savedSettings)) return fallback;
    const settings = {
      baseURL: savedSettings.baseURL || fallback.baseURL,
      apiKey: savedSettings.apiKey || fallback.apiKey,
      model: savedSettings.model || fallback.model,
      instructions: savedSettings.instructions || fallback.instructions,
      allowOverwrite: savedSettings.allowOverwrite,
    };
    return settings;
  },
  set: async (settings: Settings): Promise<void> => {
    await chrome.storage.local.set({
      baseURL: settings.baseURL,
      apiKey: settings.apiKey,
      model: settings.model,
      instructions: settings.instructions,
      allowOverwrite: settings.allowOverwrite,
    });
  },
};

export default Settings;
