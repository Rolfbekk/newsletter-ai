import OpenAI from "openai";

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  url: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  relevanceScore?: number;
}

interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  created_utc: number;
  parent_id: string;
  permalink: string;
}

interface NewsletterSection {
  title: string;
  content: string;
  type: 'summary' | 'analysis' | 'trends' | 'insights' | 'discussions';
}

interface AIGeneratedNewsletter {
  title: string;
  introduction: string;
  sections: NewsletterSection[];
  keyTakeaways: string[];
  conclusion: string;
  tone: 'professional' | 'casual' | 'enthusiastic';
}

class AIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  async generateEngagingNewsletter(
    topic: string,
    posts: RedditPost[],
    comments: RedditComment[],
    timeFilter: 'week' | 'month',
    format: 'brief' | 'detailed' | 'visual' = 'detailed'
  ): Promise<AIGeneratedNewsletter> {
    try {
      console.log(`Generating AI newsletter for topic: "${topic}"`);

      // Prepare content for AI analysis
      const contentSummary = this.prepareContentForAI(posts, comments);
      
      // Generate the newsletter using AI
      const newsletter = await this.createNewsletterWithAI(topic, contentSummary, timeFilter, format);
      
      return newsletter;
    } catch (error) {
      console.error('Error generating AI newsletter:', error);
      throw new Error('Failed to generate AI newsletter');
    }
  }

  private prepareContentForAI(posts: RedditPost[], comments: RedditComment[]): string {
    // Sort posts by relevance score and engagement
    const sortedPosts = posts
      .sort((a, b) => {
        const aScore = (a.relevanceScore || 0) * 0.7 + (a.score + a.num_comments) * 0.3;
        const bScore = (b.relevanceScore || 0) * 0.7 + (b.score + b.num_comments) * 0.3;
        return bScore - aScore;
      })
      .slice(0, 12);

    // Sort comments by score and relevance
    const sortedComments = comments
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    let content = "=== TOP REDDIT POSTS ===\n\n";
    
    sortedPosts.forEach((post, index) => {
      const engagement = post.score + post.num_comments;
      const relevance = post.relevanceScore || 0;
      
      content += `${index +1}.${post.title}"\n`;
      content += `   📍 r/${post.subreddit} | ⬆️ ${post.score} | 💬 ${post.num_comments} | 🔗 ${engagement} total engagement\n`;
      content += `   👤 u/${post.author}\n`;
      
      if (post.selftext) {
        const cleanText = post.selftext.replace(/\n+/g, ' ').trim();
        content += `   📝 ${cleanText.substring(0, 400)}${cleanText.length > 400 ? '...' : ''}\n`;
      }
      content += `   🔗 ORIGINAL POST: https://reddit.com${post.permalink}\n\n`;
    });

    content += "=== TOP COMMENTS ===\n\n";
    
    sortedComments.forEach((comment, index) => {
      const cleanBody = comment.body.replace(/\n+/g, ' ').trim();
      content += `${index + 1}. u/${comment.author} (⬆️ ${comment.score})\n`;
      content += `   💬 ${cleanBody.substring(0, 300)}${cleanBody.length >30? '...' : ''}\n`;
      content += `   🔗 COMMENT: https://reddit.com${comment.permalink}\n\n`;
    });

    // Add summary statistics
    const totalPosts = posts.length;
    const totalComments = comments.length;
    const avgPostScore = posts.length > 0 ? Math.round(posts.reduce((sum, p) => sum + p.score, 0) / posts.length) : 0;
    const avgCommentScore = comments.length > 0 ? Math.round(comments.reduce((sum, c) => sum + c.score, 0) / comments.length) : 0;

    content += `=== SUMMARY STATISTICS ===\n`;
    content += `📊 Total Posts: ${totalPosts} | Total Comments: ${totalComments}\n`;
    content += `📈 Avg Post Score: ${avgPostScore} | Avg Comment Score: ${avgCommentScore}\n`;
    content += `🏆 Top Subreddits: ${this.getTopSubreddits(posts)}\n\n`;

    return content;
  }

  private getTopSubreddits(posts: RedditPost[]): string {
    const subredditCounts = posts.reduce((acc, post) => {
      acc[post.subreddit] = (acc[post.subreddit] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(subredditCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([sub, count]) => `r/${sub} (${count})`)
      .join(', ');
  }

  private getFormatInstructions(format: 'brief' | 'detailed' | 'visual'): string {
    switch (format) {
      case 'brief':
        return `BRIEF FORMAT INSTRUCTIONS:
- Keep content concise and focused on key points
- Limit to 5-7 key takeaways maximum
- Write shorter sections (2-3 paragraphs max)
- Focus on executive summary style
- Use bullet points and numbered lists
- Prioritize the most important insights only`;
      
      case 'detailed':
        return `DETAILED FORMAT INSTRUCTIONS:
- Provide comprehensive analysis and insights
- Include 4-5 detailed sections
- Write longer, in-depth content
- Include multiple perspectives and deep analysis
- Use detailed examples and explanations
- Cover all major trends and discussions`;
      
      case 'visual':
        return `VISUAL FORMAT INSTRUCTIONS:
- Structure content for easy visual scanning
- Use clear section headers and subheaders
- Include visual-friendly elements like lists and highlights
- Write content that works well with visual formatting
- Use descriptive language that can be enhanced with visual elements
- Focus on scannable content structure`;
      
      default:
        return `DETAILED FORMAT INSTRUCTIONS:
- Provide comprehensive analysis and insights
- Include 4-5 detailed sections
- Write longer, in-depth content
- Include multiple perspectives and deep analysis
- Use detailed examples and explanations
- Cover all major trends and discussions`;
    }
  }

  private async createNewsletterWithAI(
    topic: string,
    contentSummary: string,
    timeFilter: 'week' | 'month',
    format: 'brief' | 'detailed' | 'visual'
  ): Promise<AIGeneratedNewsletter> {
    const prompt = this.buildNewsletterPrompt(topic, contentSummary, timeFilter, format);


    try {
      console.log('Making API call to OpenAI...');
      const modelName = "gpt-4o-mini";
      console.log('Using model:', modelName);
      
      // Build the request payload
      const requestPayload = {
        model: modelName,
        messages: [
          {
            role: 'system' as const,
            content: `You are an expert newsletter writer who creates engaging, insightful newsletters about technology and business topics. You have a deep understanding of Reddit communities and can extract valuable insights from discussions. Write in a professional yet engaging tone that makes complex topics accessible.`
          },
          {
            role: 'user' as const,
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      };
      
      // Log the full request payload for debugging
      console.log('=== FULL REQUEST PAYLOAD ===');
      console.log('Model:', requestPayload.model);
      console.log('Temperature:', requestPayload.temperature);
      console.log('Max Tokens:', requestPayload.max_tokens);
      console.log('System Message Length:', requestPayload.messages[0].content.length, 'characters');
      console.log('User Message Length:', requestPayload.messages[1].content.length, 'characters');
      console.log('Total Payload Size:', JSON.stringify(requestPayload).length, 'characters');
      
      // Log a preview of the user message (first 500 chars)
      const userMessagePreview = requestPayload.messages[1].content.substring(0, 500);
      console.log('User Message Preview:', userMessagePreview + (requestPayload.messages[1].content.length > 500 ? '...' : ''));
      
      // Check for potential issues
      if (requestPayload.messages[1].content.length > 32000) {
        console.warn('⚠️ WARNING: User message is very large (>32k chars), this might cause issues');
      }
      if (JSON.stringify(requestPayload).length > 100000) {
        console.warn('⚠️ WARNING: Total payload is very large (>100k chars), this might cause issues');
      }
      
      console.log('=== END REQUEST PAYLOAD ===');
      
      const response = await this.openai.chat.completions.create(requestPayload);
      
      console.log('✅ API call successful!');
      const aiResponse = response.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response from AI service');
      }
      
      return this.parseAIResponse(aiResponse, topic);
    } catch (error: any) {
      console.error('❌ API call failed!');
      console.error('Error type:', error.constructor.name);
      console.error('Error status:', error.status);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        console.error('Response data:', error.response.data);
      }
      
      throw error;
    }
  }

  private buildNewsletterPrompt(topic: string, contentSummary: string, timeFilter: 'week' | 'month', format: 'brief' | 'detailed' | 'visual'): string {
    const formatInstructions = this.getFormatInstructions(format);
    
    return `You are an expert newsletter writer specializing in technology and market research. Create a compelling, data-driven newsletter about "${topic}" based on the Reddit community discussions from the past ${timeFilter}.

FORMAT: ${format.toUpperCase()}
${formatInstructions}

INSTRUCTIONS:
- Analyze the Reddit content to identify trends, insights, and key discussions
- Write in an engaging, professional tone
- Focus on actionable insights and real community sentiment
- Use specific examples from the Reddit posts and comments
- Include data points and statistics when available
- Make complex topics accessible to a general audience
- **IMPORTANT**: When referencing Reddit posts, users, or subreddits, include clickable links to the original posts
- Use markdown link format: [text](url) for all references to Reddit content
- Always link to the original post URL when mentioning specific posts or discussions
- Use the provided Reddit permalinks (starting with https://reddit.com) to link to the actual Reddit posts and comments

CONTENT TO ANALYZE:
${contentSummary}

NEWSLETTER REQUIREMENTS:
1. **Title**: Catchy, SEO-friendly title that captures the main theme
2. **Introduction**: Hook the reader with a compelling opening that sets context
3. **Sections**: 3-4 well-structured sections covering:
   - Trending topics and discussions
   - Key insights and analysis
   - Community sentiment and concerns
   - Future implications and opportunities
4. **Key Takeaways**: 4-5 actionable insights or important points
5. **Conclusion**: Wrap up with forward-looking perspective

RESPONSE FORMAT:
Return ONLY valid JSON with this exact structure:
{
  "title": "Your engaging title here",
  "introduction": "Compelling introduction paragraph with clickable links to Reddit posts using markdown format [text](url)...",
  "sections": [
    {
      "title": "Section title",
      "content": "Section content with specific examples and insights. Use markdown links like [Post Title](url) when referencing Reddit content...",
      "type": "trends"
    },
    {
      "title": "Section title", 
      "content": "Section content with clickable links to original posts using [text](url) format...",
      "type": "insights"
    },
    {
      "title": "Section title",
      "content": "Section content with links to Reddit discussions using markdown format...", 
      "type": "analysis"
    }
  ],
  "    keyTakeaways": [
      "Specific, actionable takeaway 1,
      "Specific, actionable takeaway 2,
      "Specific, actionable takeaway 3,
      "Specific, actionable takeaway 4"
    ],
  "conclusion": "Forward-looking conclusion that ties everything together with references to original Reddit posts...",
  "tone": "professional"
}

IMPORTANT: Ensure your response is valid JSON. Do not include any text before or after the JSON object.`;
  }

  private parseAIResponse(aiResponse: string, topic: string): AIGeneratedNewsletter {
    console.log('Parsing AI response...');
    
    try {
      // Clean the response - remove any markdown formatting
      let cleanResponse = aiResponse.trim();
      
      // Remove markdown code blocks if present
      cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      
      // Try to extract JSON from the response
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        console.log('Found JSON match, attempting to parse...');
        
        const parsed = JSON.parse(jsonString);
        console.log('✅ JSON parsed successfully');
        
        // Validate and sanitize the parsed data
        const newsletter: AIGeneratedNewsletter = {
          title: this.sanitizeString(parsed.title) || `${topic} Weekly Digest`,
          introduction: this.sanitizeString(parsed.introduction) || `Here's what's happening in the ${topic} space this week.`,
          sections: this.sanitizeSections(parsed.sections || []),
          keyTakeaways: this.sanitizeArray(parsed.keyTakeaways || []),
          conclusion: this.sanitizeString(parsed.conclusion) || `The ${topic} landscape continues to evolve rapidly.`,
          tone: this.sanitizeTone(parsed.tone)
        };
        
        console.log('Newsletter structure validated:', {
          title: newsletter.title,
          sectionsCount: newsletter.sections.length,
          takeawaysCount: newsletter.keyTakeaways.length
        });
        
        return newsletter;
      } else {
        console.log('No JSON match found in response');
      }
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      console.error('Raw response:', aiResponse.substring(0, 500) + '...');
    }

    // Fallback: create a basic structure from the text
    console.log('Using fallback newsletter generation');
    return this.createFallbackNewsletter(aiResponse, topic);
  }

  private sanitizeString(str: any): string {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/\n+/g, ' ').substring(0, 2000);
  }

  private sanitizeArray(arr: any): string[] {
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(item => typeof item === 'string' && item.trim().length > 0)
      .map(item => this.sanitizeString(item))
      .slice(0, 5); // Limit to 5 items
  }

  private sanitizeSections(sections: any[]): NewsletterSection[] {
    if (!Array.isArray(sections)) return [];
    
    return sections
      .filter(section => section && typeof section === 'object')
      .map(section => ({
        title: this.sanitizeString(section.title) || 'Section',
        content: this.sanitizeString(section.content) || 'Content not available.',
        type: this.sanitizeSectionType(section.type)
      }))
      .slice(0, 4); // Limit to 4 sections
  }

  private sanitizeSectionType(type: any): 'summary' | 'analysis' | 'trends' | 'insights' | 'discussions' {
    const validTypes = ['summary', 'analysis', 'trends', 'insights', 'discussions'];
    return validTypes.includes(type) ? type : 'insights';
  }

  private sanitizeTone(tone: any): 'professional' | 'casual' | 'enthusiastic' {
    const validTones = ['professional', 'casual', 'enthusiastic'];
    return validTones.includes(tone) ? tone : 'professional';
  }

  private createFallbackNewsletter(aiResponse: string, topic: string): AIGeneratedNewsletter {
    console.log('Creating fallback newsletter from AI response');
    
    // Clean and split the response
    const cleanResponse = aiResponse.replace(/\n+/g, '\n').trim();
    const paragraphs = cleanResponse.split('\n\n').filter(p => p.trim().length > 20);
    
    // Extract meaningful content
    const title = this.extractTitle(cleanResponse, topic);
    const introduction = paragraphs[0] || `Here's what's happening in the ${topic} space this week.`;
    const conclusion = paragraphs[paragraphs.length - 1] || `The ${topic} landscape continues to evolve rapidly.`;
    
    // Create sections from middle paragraphs
    const middleParagraphs = paragraphs.slice(1, -1);
    const sections: NewsletterSection[] = [];
    
    if (middleParagraphs.length >= 2) {
      sections.push({
        title: 'Trending Discussions',
        content: middleParagraphs[0],
        type: 'trends'
      });
      
      if (middleParagraphs.length >= 3) {
        sections.push({
          title: 'Key Insights',
          content: middleParagraphs[1],
          type: 'insights'
        });
        
        if (middleParagraphs.length >= 4) {
          sections.push({
            title: 'Community Analysis',
            content: middleParagraphs[2],
            type: 'analysis'
          });
        }
      }
    } else if (middleParagraphs.length === 1) {
      sections.push({
        title: 'Community Insights',
        content: middleParagraphs[0],
        type: 'insights'
      });
    } else {
      sections.push({
        title: 'Overview',
        content: 'Analysis of the latest trends and discussions in the community.',
        type: 'summary'
      });
    }
    
    // Generate key takeaways
    const keyTakeaways = [
      `Stay updated with the latest ${topic} developments`,
      `Engage with the community for insights and discussions`,
      `Explore practical applications and real-world use cases`,
      `Monitor emerging trends and opportunities`
    ];
    
    return {
      title,
      introduction,
      sections,
      keyTakeaways,
      conclusion,
      tone: 'professional'
    };
  }

  private extractTitle(response: string, topic: string): string {
    // Try to extract a title from the response
    const lines = response.split('\n');
    const firstLine = lines[0]?.trim();
    
    if (firstLine && firstLine.length > 10 && firstLine.length < 100) {
      // Check if it looks like a title
      if (!firstLine.includes('.') && !firstLine.includes(':')) {
        return firstLine;
      }
    }
    
    // Fallback to generated title
    return `${topic} Weekly Digest`;
  }

  async generateSectionSummary(sectionTitle: string, posts: RedditPost[], comments: RedditComment[]): Promise<string> {
    try {
      const content = this.prepareContentForAI(posts, comments);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: 'system',
            content: 'You are an expert content analyst who creates concise, engaging summaries of Reddit discussions.'
          },
          {
            role: 'user',
            content: `Create a 2-3 paragraph summary for the section "${sectionTitle}" based on this Reddit content. Make it engaging and insightful:\n\n${content}`
          }
        ],
        temperature: 0.6,
        max_tokens: 500
      });

      return response.choices[0]?.message?.content || 'Summary not available';
    } catch (error) {
      console.error('Error generating section summary:', error);
      return 'Summary not available';
    }
  }

  async extractKeyInsights(posts: RedditPost[], comments: RedditComment[]): Promise<string[]> {
    try {
      const content = this.prepareContentForAI(posts, comments);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: 'system',
            content: 'You are an expert analyst who extracts key insights from online discussions.'
          },
          {
            role: 'user',
            content: `Extract 5 key insights from this Reddit content. Return them as a JSON array of strings:\n\n${content}`
          }
        ],
        temperature: 0.5,
        max_tokens: 300
      });

      const aiResponse = response.choices[0]?.message?.content;
      if (aiResponse) {
        try {
          const insights = JSON.parse(aiResponse);
          return Array.isArray(insights) ? insights : [];
        } catch {
          // Fallback: extract insights from text
          return aiResponse.split('\n').filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('•')).slice(0, 5);
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error extracting key insights:', error);
      return [];
    }
  }
}

export const aiService = new AIService(); 