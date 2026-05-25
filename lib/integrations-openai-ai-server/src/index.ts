import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

export type DocFormat = "readme" | "api-reference" | "changelog" | "onboarding";

const FORMAT_PROMPTS: Record<DocFormat, string> = {
  readme: `You are a technical writer creating a README.md file. Generate comprehensive documentation that includes:
- Project title and description
- Features list
- Installation instructions
- Usage examples with code snippets
- API reference if applicable
- Configuration options
- Contributing guidelines
- License information

Make it professional, clear, and developer-friendly.`,

  "api-reference": `You are a technical writer creating API documentation. Generate comprehensive API reference documentation that includes:
- Endpoint descriptions
- Request/response formats
- Parameter details with types
- Authentication requirements
- Code examples in multiple languages
- Error codes and handling
- Rate limiting information if applicable

Format using standard API documentation conventions with clear headers and tables.`,

  changelog: `You are a technical writer creating a CHANGELOG. Generate a well-formatted changelog that includes:
- Version numbers following semantic versioning
- Release dates
- Categories: Added, Changed, Deprecated, Removed, Fixed, Security
- Clear descriptions of each change
- Migration notes where applicable
- Links to related issues/PRs if mentioned

Follow the Keep a Changelog format.`,

  onboarding: `You are a technical writer creating developer onboarding documentation. Generate a comprehensive onboarding guide that includes:
- Quick start guide
- Environment setup instructions
- Project structure overview
- Development workflow
- Common tasks and how to accomplish them
- Troubleshooting section
- Resources and links for further learning

Make it welcoming and easy to follow for new developers.`,
};

export async function generateDocumentation(
  content: string,
  format: DocFormat
): Promise<string> {
  const systemPrompt = FORMAT_PROMPTS[format];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Generate ${format} documentation for the following content:\n\n${content}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return response.choices[0]?.message?.content || "Failed to generate documentation.";
}

export { openai };
