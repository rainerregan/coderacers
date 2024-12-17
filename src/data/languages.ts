import javascriptSnippets from './snippets/javascript.json';

export interface CodeSnippet {
  id: number;
  snippet: string;
}

export interface ProgrammingLanguage {
  id: string;
  name: string;
  snippets?: CodeSnippet[];
}

export enum ProgrammingLanguageEnum {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  JAVA = 'java',
  CSHARP = 'csharp',
  PHP = 'php',
  RUBY = 'ruby',
  GO = 'go',
  TYPESCRIPT = 'typescript',
  C = 'c',
  SWIFT = 'swift',
  KOTLIN = 'kotlin',
  RUST = 'rust',
  SCALA = 'scala',
  ELIXIR = 'elixir',
  HASKELL = 'haskell',
  CLOJURE = 'clojure',
  PERL = 'perl',
  R = 'r',
  SHELL = 'shell',
  SQL = 'sql',
  HTML = 'html',
  CSS = 'css',
  SCSS = 'scss',
  LESS = 'less',
  STYLUS = 'stylus',
  MARKDOWN = 'markdown',
  YAML = 'yaml',
  JSON = 'json',
  XML = 'xml',
  GRAPHQL = 'graphql',
  BASH = 'bash',
}

export const programmingLanguages: ProgrammingLanguage[] = [
  {
    id: 'javascript',
    name: 'Javascript'
  },
  {
    id: 'python',
    name: 'Python'
  },
  {
    id: 'java',
    name: 'Java'
  },
  {
    id: 'csharp',
    name: 'C#'
  },
  {
    id: 'php',
    name: 'PHP'
  },
  {
    id: 'ruby',
    name: 'Ruby'
  },
  {
    id: 'go',
    name: 'Go'
  },
  {
    id: 'typescript',
    name: 'Typescript'
  },
  {
    id: 'c',
    name: 'C'
  },
  {
    id: 'swift',
    name: 'Swift'
  },
  {
    id: 'kotlin',
    name: 'Kotlin'
  },
  {
    id: 'rust',
    name: 'Rust'
  },
  {
    id: 'scala',
    name: 'Scala'
  },
  {
    id: 'elixir',
    name: 'Elixir'
  },
  {
    id: 'haskell',
    name: 'Haskell'
  },
  {
    id: 'clojure',
    name: 'Clojure'
  },
  {
    id: 'perl',
    name: 'Perl'
  },
  {
    id: 'r',
    name: 'R'
  },
  {
    id: 'shell',
    name: 'Shell'
  },
  {
    id: 'sql',
    name: 'SQL'
  },
  {
    id: 'html',
    name: 'HTML'
  },
  {
    id: 'css',
    name: 'CSS'
  },
  {
    id: 'scss',
    name: 'SCSS'
  },
  {
    id: 'less',
    name: 'LESS'
  },
  {
    id: 'stylus',
    name: 'Stylus'
  },
  {
    id: 'markdown',
    name: 'Markdown'
  },
  {
    id: 'yaml',
    name: 'YAML'
  },
  {
    id: 'json',
    name: 'JSON'
  },
  {
    id: 'xml',
    name: 'XML'
  },
  {
    id: 'graphql',
    name: 'GraphQL'
  },
  {
    id: 'bash',
    name: 'Bash'
  },
]

export const SnippetData: Record<ProgrammingLanguageEnum, CodeSnippet[]> = {
  [ProgrammingLanguageEnum.JAVASCRIPT]: javascriptSnippets,
  [ProgrammingLanguageEnum.PYTHON]: [],
  [ProgrammingLanguageEnum.JAVA]: [],
  [ProgrammingLanguageEnum.CSHARP]: [],
  [ProgrammingLanguageEnum.PHP]: [],
  [ProgrammingLanguageEnum.RUBY]: [],
  [ProgrammingLanguageEnum.GO]: [],
  [ProgrammingLanguageEnum.TYPESCRIPT]: [],
  [ProgrammingLanguageEnum.C]: [],
  [ProgrammingLanguageEnum.SWIFT]: [],
  [ProgrammingLanguageEnum.KOTLIN]: [],
  [ProgrammingLanguageEnum.RUST]: [],
  [ProgrammingLanguageEnum.SCALA]: [],
  [ProgrammingLanguageEnum.ELIXIR]: [],
  [ProgrammingLanguageEnum.HASKELL]: [],
  [ProgrammingLanguageEnum.CLOJURE]: [],
  [ProgrammingLanguageEnum.PERL]: [],
  [ProgrammingLanguageEnum.R]: [],
  [ProgrammingLanguageEnum.SHELL]: [],
  [ProgrammingLanguageEnum.SQL]: [],
  [ProgrammingLanguageEnum.HTML]: [],
  [ProgrammingLanguageEnum.CSS]: [],
  [ProgrammingLanguageEnum.SCSS]: [],
  [ProgrammingLanguageEnum.LESS]: [],
  [ProgrammingLanguageEnum.STYLUS]: [],
  [ProgrammingLanguageEnum.MARKDOWN]: [],
  [ProgrammingLanguageEnum.YAML]: [],
  [ProgrammingLanguageEnum.JSON]: [],
  [ProgrammingLanguageEnum.XML]: [],
  [ProgrammingLanguageEnum.GRAPHQL]: [],
  [ProgrammingLanguageEnum.BASH]: [],
}