import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { ValidationResult, IdeaSubmission } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const VALIDATION_PROMPT = `###지시사항 
주어진 **아이디어 개요(ideaBrief)**를 다각도로 분석하여 시장성·차별성·리스크·실현 가능성을 종합 진단하십시오. 

###작성지침 
1. 시장성(Market): 
- 시장 규모: 최신 보고서·공식 통계 기반 연간 매출·CAGR 등 구체 수치 제시 
- 세그먼트: 타깃 고객군을 인구통계·행태·구매력으로 세분화(최소 2개) 
- 접근성: 유통 채널·마케팅 채널 적합성 평가(온라인·오프라인 비중) 
- 트렌드 근거: 2개 이상의 근거(시장 보고서, 기사, 정책) 인용·요약 
2. 차별성(Differentiation): 
- Unique Value Proposition: 핵심 가치 1문장으로 정의 
- 경쟁사 매핑: 경쟁/대안 솔루션 3개와 기능·가격·서비스 비교 
- 강점·약점: 우리 아이디어의 강·약점 각각 최소 2가지 제시(구체 사례 포함) 
3. 리스크(Risk): 
- Technical 예) 데이터 편향, 인프라 장애, 기술 인력 부족 
- Market 예) 수요 불확실, 경쟁 심화, 가격 민감도 
- Regulatory 예) 개인정보보호법, 인증 제도, 수출 규제 
- Financial 예) 투자 자금 부족, 현금 흐름 불안, 환율 변동 
4. 실현 가능성(Feasibility): 
- TRL(1-9)·프로토타입 여부·기술 스택 적합성 평가 
- 자원: 핵심 인력 구성·예산 규모·외부 파트너 여부 
- 점수 산정: score(1-scale)·scale(기본 5)·근거 기술 
5. 개선·권장 조치(Recommendations): 최대 3가지 액션 아이템을 도출하십시오.(우선순위 포함) 
6. summary: 200자 이내로 핵심 진단·결론을 요약(장점·최대 리스크 1줄 포함) 
7. 데이터가 없거나 판단이 불가능한 항목은 반드시 문자열 "-" 하나만 출력 
8. 출력은 순수 JSON(아래 형식)으로 하며 HTML/Markdown 불가 

###출력형식 
{ 
"summary": "<200자 이내 핵심 진단 요약>", 
"evaluation": { 
"market": { 
"sizeEstimation": "<시장 규모·성장률(숫자·% 기재)>", 
"targetUsers": ["<타깃 고객 1>", "<타깃 고객 2>", "..."], 
"painPoints": "<해결하고자 하는 주요 문제·불편>" 
}, 
"differentiation": { 
"uniqueValue": "<아이디어의 고유 가치·USP>", 
"competitiveLandscape": [ 
{ "competitor": "<경쟁사 A>", "weakness": "<경쟁사 약점>" }, 
{ "competitor": "<경쟁사 B>", "weakness": "<경쟁사 약점>" }, 
{ "competitor": "<경쟁사 C>", "weakness": "<경쟁사 약점>" } 
], 
"strengths": ["<우리 아이디어 강점 1>", "<강점 2>"], 
"weaknesses": ["<약점 1>", "<약점 2>"] 
}, 
"risk": { 
"technical": [ 
{ "risk": "<기술 리스크 1>", "level": "<낮음|중간|높음>", "reason": "<사유>" }, 
{ "risk": "<기술 리스크 2>", "level": "<낮음|중간|높음>", "reason": "<사유>" }, 
{ "risk": "<기술 리스크 3>", "level": "<낮음|중간|높음>", "reason": "<사유>" } 
], 
"market": [ 
{ "risk": "<시장 리스크 1>", "level": "<낮음|중간|높음>", "reason": "<사유>" }, 
{ "risk": "<시장 리스크 2>", "level": "<낮음|중간|높음>", "reason": "<사유>" }, 
{ "risk": "<시장 리스크 3>", "level": "<낮음|중간|높음>", "reason": "<사유>" } 
], 
"regulatory": [ 
{ "risk": "<규제 리스크 1>", "level": "<낮음|중간|높음>", "reason": "<사유>" }, 
{ "risk": "<규제 리스크 2>", "level": "<낮음|중간|높음>", "reason": "<사유>" }, 
{ "risk": "<규제 리스크 3>", "level": "<낮음|중간|높음>", "reason": "<사유>" } 
], 
"financial": [ 
{ "risk": "<재무 리스크 1>", "level": "<낮음|중간|높음>", "reason": "<사유>" }, 
{ "risk": "<재무 리스크 2>", "level": "<낮음|중간|높음>", "reason": "<사유>" }, 
{ "risk": "<재무 리스크 3>", "level": "<낮음|중간|높음>", "reason": "<사유>" } 
] 
}, 
"feasibility": { 
"score": <정수>, 
"scale": <정수>, 
"justification": "<점수 근거·세부 설명>" 
} 
}, 
"recommendations": [ 
"<개선·권장 조치 1>", 
"<조치 2>", 
"<조치 3>" 
] 
}

###아이디어
{{IDEA_TEXT}}`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationResult | { error: string; details?: string }>
) {
  console.log('=== API 호출 시작 ===')
  console.log('Method:', req.method)
  console.log('Body:', req.body)
  console.log('API Key 존재:', !!process.env.OPENAI_API_KEY)
  console.log('API Key 길이:', process.env.OPENAI_API_KEY?.length || 0)

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method)
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { idea }: IdeaSubmission = req.body

    if (!idea || idea.trim() === '') {
      return res.status(400).json({ error: '아이디어를 입력해주세요.' })
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API 키가 설정되지 않았습니다.' })
    }

    const prompt = VALIDATION_PROMPT.replace('{{IDEA_TEXT}}', idea.trim())

    console.log('OpenAI 호출 시작...')
    console.log('프롬프트 길이:', prompt.length)

    const systemPrompt = "당신은 비즈니스 아이디어 검증 전문가입니다. 웹 검색을 통해 최신 시장 정보와 트렌드를 활용하여 정확하고 구체적인 분석을 제공합니다. 반드시 JSON 형식으로만 응답하세요."
    const fullPrompt = `${systemPrompt}\n\n${prompt}`

    const completion = await openai.responses.create({
      model: "gpt-4.1", // GPT-4.1 최신 모델 사용
      tools: [{ type: "web_search_preview" }],
      input: fullPrompt,
    })

    console.log('OpenAI 응답 받음')
    console.log('전체 응답:', JSON.stringify(completion, null, 2))
    console.log('응답 길이:', completion.output_text?.length || 0)

    const responseText = completion.output_text

    if (!responseText) {
      console.log('응답 텍스트가 비어있음')
      return res.status(500).json({ error: 'AI 응답을 생성하지 못했습니다.' })
    }

    // JSON 응답 파싱 시도
    try {
      // 더 강력한 마크다운 코드 블록 제거 및 JSON 정제
      let cleanedResponse = responseText.trim()
      
      // 코드 블록 제거
      cleanedResponse = cleanedResponse.replace(/^```[a-zA-Z]*\s*/, '').replace(/\s*```\s*$/, '')
      
      // JSON의 시작과 끝 찾기
      const jsonStart = cleanedResponse.indexOf('{')
      const jsonEnd = cleanedResponse.lastIndexOf('}')
      
      if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
        throw new Error('JSON 구조를 찾을 수 없습니다.')
      }
      
      // 순수 JSON만 추출
      cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1)
      
      console.log('정제된 응답 길이:', cleanedResponse.length)
      console.log('정제된 응답 시작:', cleanedResponse.substring(0, 100))
      console.log('정제된 응답 끝:', cleanedResponse.substring(cleanedResponse.length - 100))
      
      const result: ValidationResult = JSON.parse(cleanedResponse)
      
      // 응답 구조 검증
      if (!result.summary || !result.evaluation || !result.recommendations) {
        throw new Error('응답 구조가 올바르지 않습니다.')
      }
      
      return res.status(200).json(result)
    } catch (parseError: any) {
      console.error('JSON 파싱 오류:', parseError.message)
      console.error('원본 응답 길이:', responseText.length)
      
      // 원본 응답의 처음과 끝 부분만 로그로 출력
      console.error('원본 응답 시작 500자:', responseText.substring(0, 500))
      console.error('원본 응답 끝 500자:', responseText.substring(Math.max(0, responseText.length - 500)))
      
      return res.status(500).json({ 
        error: 'AI 응답 형식이 올바르지 않습니다.',
        details: process.env.NODE_ENV === 'development' ? parseError.message : undefined
      })
    }

  } catch (error: any) {
    console.error('아이디어 검증 오류 상세:', {
      message: error.message,
      status: error.status,
      code: error.code,
      response: error.response?.data,
      stack: error.stack
    })
    
    // OpenAI API 관련 에러 처리
    if (error.status === 401) {
      return res.status(500).json({ error: 'OpenAI API 키가 유효하지 않습니다.' })
    }
    
    if (error.status === 429) {
      return res.status(500).json({ error: 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' })
    }
    
    if (error.status === 400) {
      return res.status(500).json({ error: `OpenAI API 요청 오류: ${error.message}` })
    }
    
    return res.status(500).json({ 
      error: '아이디어 검증 중 오류가 발생했습니다.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
} 