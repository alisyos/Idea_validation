import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'
import { ValidationResult } from '@/types'

export const generateDocx = async (result: ValidationResult, ideaText: string) => {
  const currentDate = new Date().toLocaleDateString('ko-KR')
  
  const doc = new Document({
    sections: [
      {
        children: [
          // 제목
          new Paragraph({
            text: '🚀 아이디어 검증 AI 분석 보고서',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          
          // 생성일자
          new Paragraph({
            children: [
              new TextRun({
                text: `생성일자: ${currentDate}`,
                size: 20,
              }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
          
          new Paragraph({ text: '' }), // 빈 줄
          
          // 입력된 아이디어
          new Paragraph({
            text: '📝 분석 대상 아이디어',
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: ideaText,
                size: 22,
              }),
            ],
          }),
          
          new Paragraph({ text: '' }),
          
          // 핵심 요약
          new Paragraph({
            text: '📋 핵심 요약',
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: result.summary,
                size: 22,
              }),
            ],
          }),
          
          new Paragraph({ text: '' }),
          
          // 시장성 분석
          new Paragraph({
            text: '📈 시장성 분석',
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            text: '시장 규모',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun({ text: result.evaluation.market.sizeEstimation })],
          }),
          
          new Paragraph({
            text: '타깃 고객',
            heading: HeadingLevel.HEADING_2,
          }),
          ...result.evaluation.market.targetUsers.map(user => 
            new Paragraph({
              children: [new TextRun({ text: `• ${user}` })],
            })
          ),
          
          new Paragraph({
            text: '해결 문제',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun({ text: result.evaluation.market.painPoints })],
          }),
          
          new Paragraph({ text: '' }),
          
          // 차별성 분석
          new Paragraph({
            text: '⭐ 차별성 분석',
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            text: '고유 가치 제안',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun({ text: result.evaluation.differentiation.uniqueValue })],
          }),
          
          new Paragraph({
            text: '강점',
            heading: HeadingLevel.HEADING_2,
          }),
          ...result.evaluation.differentiation.strengths.map(strength => 
            new Paragraph({
              children: [new TextRun({ text: `✓ ${strength}` })],
            })
          ),
          
          new Paragraph({
            text: '약점',
            heading: HeadingLevel.HEADING_2,
          }),
          ...result.evaluation.differentiation.weaknesses.map(weakness => 
            new Paragraph({
              children: [new TextRun({ text: `⚠ ${weakness}` })],
            })
          ),
          
          new Paragraph({
            text: '경쟁사 분석',
            heading: HeadingLevel.HEADING_2,
          }),
          ...result.evaluation.differentiation.competitiveLandscape.map(competitor => 
            new Paragraph({
              children: [new TextRun({ text: `• ${competitor.competitor}: ${competitor.weakness}` })],
            })
          ),
          
          new Paragraph({ text: '' }),
          
          // 리스크 분석
          new Paragraph({
            text: '⚠️ 리스크 분석',
            heading: HeadingLevel.HEADING_1,
          }),
          
          // 기술 리스크
          new Paragraph({
            text: '기술 리스크',
            heading: HeadingLevel.HEADING_2,
          }),
          ...result.evaluation.risk.technical.map(risk => 
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `[${risk.level}] ${risk.risk}: ${risk.reason}`,
                }),
              ],
            })
          ),
          
          // 시장 리스크
          new Paragraph({
            text: '시장 리스크',
            heading: HeadingLevel.HEADING_2,
          }),
          ...result.evaluation.risk.market.map(risk => 
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `[${risk.level}] ${risk.risk}: ${risk.reason}`,
                }),
              ],
            })
          ),
          
          // 규제 리스크
          new Paragraph({
            text: '규제 리스크',
            heading: HeadingLevel.HEADING_2,
          }),
          ...result.evaluation.risk.regulatory.map(risk => 
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `[${risk.level}] ${risk.risk}: ${risk.reason}`,
                }),
              ],
            })
          ),
          
          // 재무 리스크
          new Paragraph({
            text: '재무 리스크',
            heading: HeadingLevel.HEADING_2,
          }),
          ...result.evaluation.risk.financial.map(risk => 
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `[${risk.level}] ${risk.risk}: ${risk.reason}`,
                }),
              ],
            })
          ),
          
          new Paragraph({ text: '' }),
          
          // 실현 가능성
          new Paragraph({
            text: '🎯 실현 가능성',
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ 
                text: `점수: ${result.evaluation.feasibility.score}/${result.evaluation.feasibility.scale}점`,
                bold: true,
                size: 24,
              }),
            ],
          }),
          
          new Paragraph({
            children: [new TextRun({ text: result.evaluation.feasibility.justification })],
          }),
          
          new Paragraph({ text: '' }),
          
          // 권장 조치
          new Paragraph({
            text: '💡 권장 조치',
            heading: HeadingLevel.HEADING_1,
          }),
          
          ...result.recommendations.map((recommendation, index) => 
            new Paragraph({
              children: [new TextRun({ text: `${index + 1}. ${recommendation}` })],
            })
          ),
          
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),
          
          // 푸터
          new Paragraph({
            children: [
              new TextRun({
                text: '본 보고서는 아이디어 검증 AI(GPT-4.1)를 통해 생성되었습니다.',
                italics: true,
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: '실제 비즈니스 결정 시에는 전문가와 상담하시기 바랍니다.',
                italics: true,
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
    ],
  })

  // DOCX 파일 생성 및 다운로드
  const blob = await Packer.toBlob(doc)
  const fileName = `아이디어_검증_분석보고서_${currentDate.replace(/\//g, '')}.docx`
  saveAs(blob, fileName)
} 