import van from "vanjs-core";
import { reactive } from "vanjs-ext";
import Settings, { fallback } from "../helpers/settings";

import "../styles/popup.css";

const { div, input, textarea, label, button } = van.tags;

const Main = async () => {
  const savedSettings = await Settings.get();
  const settings = reactive(savedSettings);
  const buttonText = van.state("Save");

  return div(
    { class: "container" },
    div(
      { class: "field" },
      label({ class: "label", htmlFor: "baseURL" }, "Base URL"),
      input({
        placeholder: fallback.baseURL,
        class: "input",
        id: "baseURL",
        name: "baseURL",
        value: settings.baseURL,
        oninput: (event) => {
          const target = event.target as HTMLInputElement;
          settings.baseURL = target.value;
        },
      }),
    ),
    div(
      { class: "field" },
      label({ class: "label", htmlFor: "apiKey" }, "API Key"),
      input({
        placeholder: "sk-",
        class: "input",
        id: "apiKey",
        name: "apiKey",
        value: settings.apiKey,
        oninput: (event) => {
          const target = event.target as HTMLInputElement;
          settings.apiKey = target.value;
        },
      }),
    ),
    div(
      { class: "field" },
      label({ class: "label", htmlFor: "model" }, "Model"),
      input({
        placeholder: fallback.model,
        class: "input",
        id: "model",
        name: "model",
        value: settings.model,
        oninput: (event) => {
          const target = event.target as HTMLInputElement;
          settings.model = target.value;
        },
      }),
    ),
    div(
      { class: "field" },
      label({ class: "label", htmlFor: "instructions" }, "Instructions"),
      textarea({
        placeholder: fallback.instructions,
        class: "textarea",
        id: "instructions",
        name: "instructions",
        rows: 5,
        value: settings.instructions,
        oninput: (event) => {
          const target = event.target as HTMLTextAreaElement;
          settings.instructions = target.value;
        },
      }),
    ),
    div(
      { class: "checkbox-field" },
      input({
        type: "checkbox",
        class: "checkbox",
        name: "allowOverwrite",
        id: "allowOverwrite",
        checked: settings.allowOverwrite,
        onchange: (event) => {
          const target = event.target as HTMLInputElement;
          settings.allowOverwrite = target.checked;
        },
      }),
      label({ class: "label", htmlFor: "allowOverwrite" }, "Allow overwrite"),
    ),
    button(
      {
        class: "btn btn-solid btn-md",
        onclick: async () => {
          await Settings.set(settings);
          buttonText.val = "Saved!";
          setTimeout(() => {
            buttonText.val = "Save";
          }, 1500);
        },
      },
      buttonText,
    ),
  );
};

// biome-ignore lint/style/noNonNullAssertion:
const app = document.querySelector<HTMLDivElement>("#app")!;
(async () => van.add(app, await Main()))();
