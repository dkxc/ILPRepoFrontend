export const getFormattedStringFromFileTypes = (fileTypes: any) => {
  const extensions = Object.keys(fileTypes).map((ext) => ext.toUpperCase());
  if (extensions.length <= 1) {
    return extensions[0] || "";
  }
  const lastExtension = extensions.pop();
  return `${extensions.join(", ")} or ${lastExtension}`;
};
