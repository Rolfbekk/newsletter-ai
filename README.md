# Newsletter AI - Reddit Edition 🚀

A powerful, AI-driven newsletter platform that creates personalized newsletters from Reddit communities. Get comprehensive insights, trending topics, and the best content from your favorite subreddits.

## ✨ Features

### 🔥 Comprehensive Reddit Integration
- **Multi-Subreddit Analysis**: Combine multiple subreddits for domain-specific newsletters
- **Time-Based Filtering**: Weekly or monthly content analysis
- **Trending Topic Detection**: AI-powered keyword extraction and topic analysis
- **Top Contributors**: Identify the most active and influential community members
- **Engagement Analytics**: Detailed statistics on upvotes, comments, and community activity

### 📊 Advanced Analytics
- **Community Insights**: Automated insights about community engagement and trends
- **Content Scoring**: Rank posts by popularity and engagement
- **Topic Clustering**: Group related content by trending keywords
- **Performance Metrics**: Track community growth and activity patterns

### 🎨 Beautiful Interface
- **Real-time Preview**: See your newsletter as you build it
- **Interactive Controls**: Customize time periods and analysis depth
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations

### 📧 Email Integration
- **Newsletter Signup**: Subscribe to receive weekly newsletters via email
- **Topic-based Subscriptions**: Sign up for specific topics of interest
- **Test Newsletter Feature**: Send test newsletters to verify email delivery
- **Multiple Formats**: Support for different newsletter formats (brief, detailed, visual)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- SendGrid account (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd newsletter-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up SendGrid (for email functionality)**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # SendGrid Configuration
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   SENDGRID_FROM_EMAIL=newsletter@yourdomain.com
   SENDGRID_FROM_NAME=Newsletter AI
   SENDGRID_WEBHOOK_SECRET=your_webhook_secret_here
   ```
   
   **To get your SendGrid API key:**
   1. Sign up at [sendgrid.com](https://sendgrid.com)
   2. Go to Settings → API Keys
   3. Create a new API key with "Mail Send" permissions
   4. Copy the API key to your `.env.local` file

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 How to Use

### 1. Select Reddit Communities
Choose from popular subreddits or enter custom ones:
- **Tech**: `programming`, `webdev`, `reactjs`, `nextjs`
- **Business**: `entrepreneur`, `startups`, `productivity`
- **AI/ML**: `MachineLearning`, `artificial`, `OpenAI`
- **Design**: `design`, `web_design`, `UI_Design`

### 2. Configure Newsletter Settings
- **Time Period**: Weekly or monthly analysis
- **Analysis Level**: Simple posts or comprehensive insights
- **Content Limit**: Control the number of posts per subreddit

### 3. Generate Your Newsletter
Click "Generate Newsletter" to create a personalized report with:
- 📈 Trending topics and keywords
- 🔥 Top posts by engagement
- 👑 Most active contributors
- 💡 Community insights and analytics

## 🔧 API Endpoints

### Reddit Newsletter API
```
GET /api/reddit-newsletter?subreddits=programming,webdev&timeFilter=week&includeAnalysis=true
```

**Parameters:**
- `subreddits`: Comma-separated list of subreddit names
- `timeFilter`: `week` or `month`
- `includeAnalysis`: `true` for comprehensive analysis, `false` for simple posts

**Response:**
```json
{
  "success": true,
  "newsletter": {
    "title": "Reddit Newsletter: programming, webdev",
    "subreddits": ["programming", "webdev"],
    "timeFilter": "week",
    "summary": {
      "totalPosts": 30,
      "totalUpvotes": 15420,
      "totalComments": 2340,
      "averageScore": 514
    },
    "topPosts": [...],
    "trendingTopics": [...],
    "topContributors": [...],
    "insights": [...]
  }
}
```

### Test Endpoints
- `GET /api/test-reddit` - Test Reddit API functionality
- `GET /api/status` - Check API status and cache statistics

### Email Integration API
```
POST /api/email-signup
```
**Body:**
```json
{
  "email": "user@example.com",
  "topic": "React Development",
  "newsletterFormat": "detailed"
}
```

```
POST /api/send-test-newsletter
```
**Body:**
```json
{
  "email": "user@example.com",
  "topic": "React Development",
  "newsletterFormat": "detailed"
}
```

```
POST /api/send-newsletter
```
**Body:**
```json
{
  "email": "user@example.com",
  "topic": "React Development",
  "newsletterFormat": "detailed",
  "newsletterContent": {
    "title": "Weekly React Development Newsletter",
    "introduction": "Welcome to this week's React insights...",
    "sections": [...],
    "keyTakeaways": [...],
    "conclusion": "Thanks for reading..."
  }
}
```

```
POST /api/webhooks/sendgrid
```
**Webhook endpoint for SendGrid event tracking (delivered, opened, clicked, bounced, etc.)**

```
GET /api/webhooks/sendgrid?messageId=xxx
```
**Get analytics for a specific email message**

## 🏗️ Architecture

### Core Components

#### RedditAPI Class (`src/lib/redditApi.ts`)
- **Caching System**: Intelligent caching with TTL for performance
- **Rate Limiting**: Built-in rate limiting to respect Reddit's API
- **Error Handling**: Robust error handling and retry logic
- **Domain Analysis**: Comprehensive community analysis algorithms

#### Newsletter Components
- **RedditNewsletterPreview**: Beautiful newsletter preview with real-time generation
- **SubredditSelector**: Interactive subreddit selection interface
- **ContentPreview**: Live content preview from selected sources

### Key Features

#### Smart Caching
```typescript
// Automatic caching with 15-minute TTL
const posts = await redditAPI.getSubredditPosts('programming', 10);
```

#### Domain Analysis
```typescript
// Comprehensive analysis with trending topics and contributors
const analysis = await redditAPI.getDomainAnalysis(['programming', 'webdev'], 'week');
```

#### Trending Topic Detection
- **Keyword Extraction**: Identifies common tech/business keywords
- **Frequency Analysis**: Tracks topic popularity over time
- **Engagement Scoring**: Ranks topics by community engagement

## 🎯 Use Cases

### For Developers
- **Tech News Roundup**: Stay updated with programming and development trends
- **Framework Updates**: Track discussions about React, Next.js, and other frameworks
- **Career Insights**: Monitor job market and skill requirements

### For Entrepreneurs
- **Startup Community**: Follow entrepreneurship and startup discussions
- **Product Development**: Learn from product launches and feedback
- **Market Trends**: Track industry developments and opportunities

### For Content Creators
- **Topic Research**: Identify trending topics for content creation
- **Community Engagement**: Understand what resonates with audiences
- **Competitive Analysis**: Monitor discussions about competitors

## 🔒 Privacy & Performance

### Privacy
- **No User Data Storage**: We don't store personal information
- **Reddit API Compliance**: Respects Reddit's terms of service
- **Anonymous Access**: No authentication required for basic usage

### Performance
- **Intelligent Caching**: Reduces API calls and improves response times
- **Rate Limiting**: Prevents API abuse and ensures fair usage
- **Optimized Requests**: Efficient data fetching and processing

## 📧 SendGrid Email Integration

### Setup Instructions

1. **Create SendGrid Account**
   - Sign up at [sendgrid.com](https://sendgrid.com)
   - Verify your email address

2. **Get API Key**
   - Go to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key

3. **Configure Environment Variables**
   ```bash
   # .env.local
   SENDGRID_API_KEY=your_api_key_here
   SENDGRID_FROM_EMAIL=newsletter@yourdomain.com
   SENDGRID_FROM_NAME=Newsletter AI
   SENDGRID_WEBHOOK_SECRET=your_webhook_secret_here
   ```

4. **Set Up Webhooks (Optional)**
   - Go to Settings → Mail Settings → Event Webhook
   - Set webhook URL to: `https://yourdomain.com/api/webhooks/sendgrid`
   - Enable events: delivered, opened, clicked, bounced, dropped, spamreport, unsubscribe
   - Copy the webhook secret to your environment variables

5. **Verify Domain (Recommended)**
   - Go to Settings → Sender Authentication
   - Verify your domain for better deliverability
   - Update `SENDGRID_FROM_EMAIL` to use your verified domain

### Features Implemented

✅ **Email Service Configuration**
- SendGrid API integration
- Environment-based configuration
- Error handling and logging

✅ **Beautiful Newsletter Templates**
- Responsive HTML email templates
- Dynamic content injection
- Professional styling with gradients and icons
- Support for test vs. real newsletters

✅ **Email Tracking and Analytics**
- Open tracking
- Click tracking
- Bounce and spam detection
- Webhook event processing
- Analytics API endpoints

✅ **Webhook Handling**
- Real-time event processing
- Signature verification
- Event logging and storage
- Analytics aggregation

## 🛠️ Development
```
src/
├── app/
│   ├── api/
│   │   ├── reddit-newsletter/     # Main newsletter API
│   │   ├── test-reddit/          # Test endpoints
│   │   └── status/               # Health checks
│   └── page.tsx                  # Main application page
├── components/
│   ├── RedditNewsletterPreview.tsx  # Newsletter preview component
│   ├── SubredditSelector.tsx        # Subreddit selection
│   └── NewsletterConfig.tsx         # Main configuration
└── lib/
    └── redditApi.ts              # Reddit API client
```

### Adding New Features

#### Custom Keywords
Add domain-specific keywords in `redditApi.ts`:
```typescript
const keywords = [
  'your-keyword',
  'domain-specific-term',
  // ... existing keywords
];
```

#### New Analysis Types
Extend the `DomainAnalysis` interface and add new analysis methods:
```typescript
interface DomainAnalysis {
  // ... existing properties
  customAnalysis?: YourCustomType;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Reddit API**: For providing access to community data
- **Next.js**: For the amazing React framework
- **Tailwind CSS**: For the beautiful styling system
- **Community**: All the Reddit communities that make this possible

---

**Ready to create your personalized Reddit newsletter?** 🚀

Start exploring communities and generating insights today!
