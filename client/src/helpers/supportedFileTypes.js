import { helpers } from "vuelidate/lib/validators";

export const supportedFileTypes = val => {
  if (!helpers.req(val)) return true;

  const supportedFormat = ["svg", "png", "jpg", "jpeg"];
  const ext = val.split(".").pop();
  return supportedFormat.includes(ext);
};
