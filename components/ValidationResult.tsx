import React from 'react'
import { ValidationResult as ValidationResultType, Risk } from '@/types'

interface ValidationResultProps {
  result: ValidationResultType
  onReset: () => void
  ideaText: string
}

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case '낮음':
      return 'bg-green-100 text-green-800'
    case '중간':
      return 'bg-yellow-100 text-yellow-800'
    case '높음':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const RiskCard: React.FC<{ title: string; risks: Risk[] }> = ({ title, risks }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
    <div className="space-y-3">
      {risks.map((risk, index) => (
        <div key={index} className="flex items-start space-x-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(risk.level)}`}>
            {risk.level}
          </span>
          <div className="flex-1">
            <div className="font-medium text-sm text-gray-900">{risk.risk}</div>
            <div className="text-sm text-gray-600 mt-1">{risk.reason}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const ValidationResult: React.FC<ValidationResultProps> = ({ result, onReset, ideaText }) => {
  return (
    <div className="space-y-6">

      {/* 요약 */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">📝</span>
          <h3 className="text-xl font-bold text-gray-900">핵심 요약</h3>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">{result.summary}</p>
      </div>

      {/* 시장성 */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-2xl">📈</span>
          <h3 className="text-xl font-bold text-gray-900">시장성 분석</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">시장 규모</h4>
            <p className="text-gray-600">{result.evaluation.market.sizeEstimation}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">타깃 고객</h4>
            <ul className="text-gray-600 space-y-1">
              {result.evaluation.market.targetUsers.map((user, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                  <span>{user}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">해결 문제</h4>
            <p className="text-gray-600">{result.evaluation.market.painPoints}</p>
          </div>
        </div>
      </div>

      {/* 차별성 */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-2xl">⭐</span>
          <h3 className="text-xl font-bold text-gray-900">차별성 분석</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">고유 가치 제안</h4>
            <p className="text-gray-700 text-lg">{result.evaluation.differentiation.uniqueValue}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">강점</h4>
              <div className="space-y-2">
                {result.evaluation.differentiation.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">약점</h4>
              <div className="space-y-2">
                {result.evaluation.differentiation.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-red-500">⚠</span>
                    <span className="text-gray-700">{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">경쟁사 분석</h4>
            <div className="grid gap-3">
              {result.evaluation.differentiation.competitiveLandscape.map((competitor, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="font-medium text-gray-900">{competitor.competitor}</span>
                  <span className="text-gray-600 text-sm">{competitor.weakness}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 리스크 분석 */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-xl font-bold text-gray-900">리스크 분석</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <RiskCard title="기술 리스크" risks={result.evaluation.risk.technical} />
          <RiskCard title="시장 리스크" risks={result.evaluation.risk.market} />
          <RiskCard title="규제 리스크" risks={result.evaluation.risk.regulatory} />
          <RiskCard title="재무 리스크" risks={result.evaluation.risk.financial} />
        </div>
      </div>

      {/* 실현 가능성 */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-2xl">🎯</span>
          <h3 className="text-xl font-bold text-gray-900">실현 가능성</h3>
        </div>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-4">
            <div className="text-4xl font-bold text-primary-600">
              {result.evaluation.feasibility.score}
            </div>
            <div className="text-2xl text-gray-400">/</div>
            <div className="text-2xl text-gray-600">
              {result.evaluation.feasibility.scale}
            </div>
          </div>
          <div className="mt-2 text-gray-600">실현 가능성 점수</div>
        </div>
        
        <div className="bg-gray-100 rounded-full h-3 mb-4">
          <div 
            className="bg-primary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(result.evaluation.feasibility.score / result.evaluation.feasibility.scale) * 100}%` }}
          ></div>
        </div>
        
        <p className="text-gray-700 text-center">{result.evaluation.feasibility.justification}</p>
      </div>

      {/* 권장 조치 */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-2xl">💡</span>
          <h3 className="text-xl font-bold text-gray-900">권장 조치</h3>
        </div>
        
        <div className="space-y-4">
          {result.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">{index + 1}</span>
              </div>
              <p className="text-gray-700 flex-1">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ValidationResult 