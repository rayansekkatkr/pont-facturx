import { readFile } from "node:fs/promises";
import path from "node:path";
import Handlebars from "handlebars";

export async function loadTemplate(
  templateName: string,
): Promise<Handlebars.TemplateDelegate> {
  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    `${templateName}.xml.hbs`,
  );
  const templateContent = await readFile(templatePath, "utf-8");
  return Handlebars.compile(templateContent);
}

export async function renderInvoiceMarkdown(data: any): Promise<string> {
  const template = await loadTemplate("xmp-metadata");
  return template(data);
}
