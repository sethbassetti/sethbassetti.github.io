import { defineCollection, z} from "astro:content";
import {file } from "astro/loaders";
import {BibtexParser} from "bibtex-js-parser";


interface Paper extends Record<string, unknown> {
    title: string;
    authors: string[];
    year: number;
    venue: string; // For @inproceedings, uses booktitle; for @article, uses journal.
    url?: string;
    pdf?: string;
    abstract?: string;
    abbr?: string;
    selected?: boolean;
  }
  
  const convert = (text: string): any => {
    let entries = BibtexParser.parseToJSON(text);
  
    // Loop over each entry in the parsed data.
    entries.forEach((entry:any) => {
      // Convert the author field into a list of "First Last" strings.
      if (entry.author && typeof entry.author === "string") {
        // Split authors by " and " and then process each name.
        const authorsList = entry.author.split(" and ").map((authorStr:string) => {
          const parts = authorStr.split(",").map((s) => s.trim());
          if (parts.length === 2) {
            const [last, first] = parts;
            return `${first} ${last}`;
          }
          return authorStr.trim();
        });
        entry.author = authorsList;
      }
  
      // Convert the year field from a string to a number.
      if (entry.year && typeof entry.year === "string") {
        const yearNumber = Number(entry.year);
        if (!isNaN(yearNumber)) {
          entry.year = yearNumber;
        }
      }

      // Convert the selected field from a string to a boolean.
      if (entry.selected && typeof entry.selected === "string") {
        const selectedBoolean = entry.selected.toLowerCase() === "true";
        entry.selected = selectedBoolean;
      }
    });
  
    return entries;
  };
  
  // Example usage with defineCollection:
  const papers = defineCollection({
    loader: file("src/publications/papers.bib", { parser: (text) => convert(text) }),
    schema: z.object({
        title: z.string(),
        author: z.array(z.string()),
        year: z.number(),
        selected: z.boolean().optional(),
        venue: z.string(),
        abbr: z.string(),
        pdf: z.string(),
        html: z.string().optional(),
    })
  });

  export const collections = {papers};