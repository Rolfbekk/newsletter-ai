import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    console.log('Testing Azure OpenAI configuration...');
    
    // Check environment variables
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'AZURE_OPENAI_API_KEY is not set',
        config: {
          hasApiKey: false,
          hasEndpoint: !!endpoint,
          endpoint: endpoint ? 'Set' : 'Not set'
        }
      }, { status: 500 });
    }
    
    if (!endpoint) {
      return NextResponse.json({
        success: false,
        error: 'AZURE_OPENAI_ENDPOINT is not set',
        config: {
          hasApiKey: true,
          hasEndpoint: false,
          apiKeyLength: apiKey.length
        }
      }, { status: 500 });
    }
    
    console.log('Environment variables are set, testing OpenAI connection...');
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: endpoint,
      defaultQuery: { 'api-version': '2024-12-01-preview' },
      defaultHeaders: { 'api-key': apiKey },
    });
    
    // Try the deployment name from environment
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT?.replace(/%$/, '') || 'gpt-4o';
    const modelsToTry = [deploymentName];
    let successfulModel = null;
    let testResponse = null;
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}`);
        
        const response = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'user',
              content: 'Say "Hello, Azure OpenAI is working!"'
            }
          ],
          max_tokens: 50
        });
        
        testResponse = response.choices[0]?.message?.content;
        successfulModel = model;
        break;
        
      } catch (modelError) {
        console.log(`Model ${model} failed:`, modelError);
        continue;
      }
    }
    
    if (successfulModel) {
      return NextResponse.json({
        success: true,
        message: 'Azure OpenAI is working correctly',
        testResponse,
        successfulModel,
        config: {
          hasApiKey: true,
          hasEndpoint: true,
          apiKeyLength: apiKey.length,
          endpoint: endpoint
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'All models failed to work. Check your Azure OpenAI deployment.',
        config: {
          hasApiKey: true,
          hasEndpoint: true,
          apiKeyLength: apiKey.length,
          endpoint: endpoint,
          modelsTried: modelsToTry
        }
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Azure OpenAI test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        hasApiKey: !!process.env.AZURE_OPENAI_API_KEY,
        hasEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
        apiKeyLength: process.env.AZURE_OPENAI_API_KEY?.length || 0
      }
    }, { status: 500 });
  }
} 