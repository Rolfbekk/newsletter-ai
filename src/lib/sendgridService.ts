import sgMail from '@sendgrid/mail';
import { marked } from 'marked';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Configure marked for safe HTML output
marked.setOptions({
  breaks: true,
  gfm: true,
});

export interface NewsletterEmailData {
  email: string;
  topic: string;
  newsletterFormat: 'brief' | 'detailed' | 'visual';
  newsletterContent?: {
    title: string;
    introduction: string;
    sections: Array<{
      title: string;
      content: string;
      type: string;
    }>;
    keyTakeaways: string[];
    conclusion: string;
  };
  unsubscribeUrl?: string;
}

export interface EmailAnalytics {
  emailId: string;
  sentAt: Date;
  delivered: boolean;
  opened?: boolean;
  clicked?: boolean;
  bounced?: boolean;
}

class SendGridService {
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'newsletter@yourdomain.com';
    this.fromName = process.env.SENDGRID_FROM_NAME || 'Newsletter AI';
  }

  /**
   * Convert markdown text to HTML
   */
  private convertMarkdownToHtml(text: string): string {
    if (!text) return '';
    try {
      const result = marked(text);
      return typeof result === 'string' ? result : result.toString();
    } catch (error) {
      console.error('Error converting markdown to HTML:', error);
      return text; // Fallback to plain text
    }
  }

  /**
   * Send a test newsletter email
   */
  async sendTestNewsletter(data: NewsletterEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const subject = `Your Weekly ${data.topic} Newsletter - Test Edition`;
      const htmlContent = this.generateNewsletterTemplate(data, true);

      const msg = {
        to: data.email,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject,
        html: htmlContent,
        trackingSettings: {
          clickTracking: {
            enable: true,
            enableText: true,
          },
          openTracking: {
            enable: true,
          },
          subscriptionTracking: {
            enable: true,
            text: 'Unsubscribe from this newsletter',
            html: '<p>Unsubscribe from this newsletter</p>',
            substitutionTag: '[Unsubscribe]',
          },
        },
      };

      const response = await sgMail.send(msg);
      console.log('📧 Test newsletter sent successfully:', response[0].headers['x-message-id']);
      
      return {
        success: true,
        messageId: response[0].headers['x-message-id'] as string,
      };
    } catch (error) {
      console.error('❌ Error sending test newsletter:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send a weekly newsletter email
   */
  async sendWeeklyNewsletter(data: NewsletterEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const subject = `Your Weekly ${data.topic} Newsletter`;
      const htmlContent = this.generateNewsletterTemplate(data, false);

      const msg = {
        to: data.email,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject,
        html: htmlContent,
        trackingSettings: {
          clickTracking: {
            enable: true,
            enableText: true,
          },
          openTracking: {
            enable: true,
          },
          subscriptionTracking: {
            enable: true,
            text: 'Unsubscribe from this newsletter',
            html: '<p>Unsubscribe from this newsletter</p>',
            substitutionTag: '[Unsubscribe]',
          },
        },
        categories: ['newsletter', data.topic.toLowerCase().replace(/\s+/g, '-')],
      };

      const response = await sgMail.send(msg);
      console.log('📧 Weekly newsletter sent successfully:', response[0].headers['x-message-id']);
      
      return {
        success: true,
        messageId: response[0].headers['x-message-id'] as string,
      };
    } catch (error) {
      console.error('❌ Error sending weekly newsletter:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate beautiful newsletter HTML template
   */
  public generateNewsletterTemplate(data: NewsletterEmailData, isTest: boolean = false): string {
    const testBadge = isTest ? '<div style="background: #ff6b6b; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 20px;">TEST EDITION</div>' : '';
    
    // Get the base URL for the website
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://newsletter-ai-snowy.vercel.app';
    const viewNewsletterUrl = `${baseUrl}/newsletter/${encodeURIComponent(data.topic)}`;
    const managePreferencesUrl = `${baseUrl}/preferences`;
    const unsubscribeUrl = data.unsubscribeUrl || `${baseUrl}/unsubscribe`;
    
    const sectionsHtml = data.newsletterContent?.sections.map(section => `
      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr>
          <td style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; font-family: Arial, sans-serif;">${this.convertMarkdownToHtml(section.title)}</h3>
            <div style="color: #666; line-height: 1.6; font-family: Arial, sans-serif;">${this.convertMarkdownToHtml(section.content)}</div>
          </td>
        </tr>
      </table>
    `).join('') || '';

    const keyTakeawaysHtml = data.newsletterContent?.keyTakeaways.map((takeaway, index) => `
      <table style="width: 100%; margin: 10px 0; border-collapse: collapse;">
        <tr>
          <td style="width: 36px; vertical-align: top; padding-right: 12px;">
            <div style="background: #007bff; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: bold;">
              ${index + 1}
            </div>
          </td>
          <td style="vertical-align: top;">
            <div style="color: #333; margin: 0; font-weight: 500; line-height: 1.4;">${this.convertMarkdownToHtml(takeaway)}</div>
          </td>
        </tr>
      </table>
    `).join('') || '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="format-detection" content="telephone=no">
        <meta name="format-detection" content="date=no">
        <meta name="format-detection" content="address=no">
        <meta name="format-detection" content="email=no">
        <title>${data.topic} Newsletter</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
          .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 30px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #e9ecef; }
          .highlight { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #007bff; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; font-weight: 500; }
          .button:hover { background: #0056b3; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin: 20px 0; }
          .stat { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-number { font-size: 24px; font-weight: bold; color: #007bff; }
          .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
          /* Markdown styles */
          strong, b { font-weight: bold; }
          em, i { font-style: italic; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
          ul, ol { margin: 10px 0; padding-left: 20px; }
          li { margin: 5px 0; }
          blockquote { border-left: 4px solid #007bff; padding-left: 15px; margin: 15px 0; color: #666; }
          code { background: #f8f9fa; padding: 2px 4px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 0.9em; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; margin: 15px 0; }
          pre code { background: none; padding: 0; }
          @media (max-width: 600px) {
            body { padding: 10px; }
            .header { padding: 30px 20px; }
            .content { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${testBadge}
            <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 700;">📰 ${data.topic} Newsletter</h1>
            <p style="margin: 0; opacity: 0.9; font-size: 16px;">
              ${isTest ? 'Test Edition' : 'Weekly AI-Curated Insights'} • ${new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div class="content">
            ${data.newsletterContent ? `
              <h2 style="color: #333; margin: 0 0 20px 0;">🎉 Welcome to Your Personalized Newsletter!</h2>
              
              ${data.newsletterContent.introduction ? `
                <div class="highlight">
                  <div style="margin: 0; color: #333; font-size: 16px;">${this.convertMarkdownToHtml(data.newsletterContent.introduction)}</div>
                </div>
              ` : ''}
              
              ${sectionsHtml}
              
              ${keyTakeawaysHtml ? `
                <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                  <tr>
                    <td style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px;">
                      <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px; font-family: Arial, sans-serif;">🎯 Key Takeaways</h3>
                      ${keyTakeawaysHtml}
                    </td>
                  </tr>
                </table>
              ` : ''}
              
              ${data.newsletterContent.conclusion ? `
                <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 18px;">🏁 Conclusion</h3>
                  <div style="margin: 0; color: #155724;">${this.convertMarkdownToHtml(data.newsletterContent.conclusion)}</div>
                </div>
              ` : ''}
            ` : `
              <h2 style="color: #333; margin: 0 0 20px 0;">🎉 Welcome to Your Personalized Newsletter!</h2>
              <p style="color: #666; margin-bottom: 20px;">
                This is a test newsletter for <strong>${data.topic}</strong> in the <strong>${data.newsletterFormat}</strong> format.
              </p>
              
              <div class="highlight">
                <h3 style="color: #333; margin: 0 0 15px 0;">📊 What's Included:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #666;">
                  <li>AI-curated summaries of top ${data.topic} posts from Reddit</li>
                  <li>Key insights and trending topics</li>
                  <li>Personalized analysis and context</li>
                  <li>Direct links to original content</li>
                </ul>
              </div>
              
              <h3 style="color: #333; margin: 30px 0 15px 0;">🚀 Coming Soon:</h3>
              <p style="color: #666; margin-bottom: 20px;">Your actual weekly newsletter will include:</p>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                <li>Real-time analysis of ${data.topic} discussions</li>
                <li>Community insights and trending topics</li>
                <li>Expert commentary and analysis</li>
                <li>Curated links to the best content</li>
              </ul>
            `}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${viewNewsletterUrl}" style="display: inline-block; background: #007bff; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; font-weight: 500; font-family: Arial, sans-serif;">View Full Newsletter</a>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px 0;">This newsletter was intelligently generated by AI analyzing Reddit discussions.</p>
            <p style="margin: 0; font-size: 12px;">
              You're subscribed to receive weekly newsletters about <strong>${data.topic}</strong>.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">
              <a href="${unsubscribeUrl}" style="color: #007bff; text-decoration: none;">Unsubscribe</a> | 
              <a href="${managePreferencesUrl}" style="color: #007bff; text-decoration: none;">Manage Preferences</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get email analytics (requires SendGrid Pro or higher)
   */
  async getEmailAnalytics(messageId: string): Promise<EmailAnalytics | null> {
    try {
      // This would require SendGrid's Event Webhook or API calls
      // For now, we'll return a basic structure
      return {
        emailId: messageId,
        sentAt: new Date(),
        delivered: true,
        opened: false,
        clicked: false,
        bounced: false,
      };
    } catch (error) {
      console.error('Error getting email analytics:', error);
      return null;
    }
  }
}

export const sendGridService = new SendGridService(); 