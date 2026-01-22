import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: Request) {
  try {
    const { text, targetLang = 'ko' } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      )
    }

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to ${targetLang === 'ko' ? 'Korean' : targetLang}. Maintain the format with 'Title:' and 'Summary:' prefixes. Translate naturally and professionally.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    })

    const translation = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      translation,
      success: true,
    })
  } catch (error: any) {
    console.error('Translation Error:', error)
    return NextResponse.json(
      { 
        error: 'Translation failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
