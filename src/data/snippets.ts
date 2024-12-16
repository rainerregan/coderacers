export interface CodeSnippet {
  id: number;
  language: string;
  snippet: string;
}

const codeSnippets: CodeSnippet[] = [
  {
    id: 1,
    language: "javascript",
    snippet: `function greet(name) {
  return name;
}`,
  },
  {
    id: 2,
    language: "python",
    snippet: `def greet(name):
  return f"Hello, {name}!"`,
  },
  // Add more snippets
];

export default codeSnippets;