import React, { useState } from 'react'
import axios from 'axios'
import IdeaForm from '@/components/IdeaForm'
import ValidationResult from '@/components/ValidationResult'
import { ValidationResult as ValidationResultType, IdeaSubmission } from '@/types'

const HomePage: React.FC = () => {
  const [result, setResult] = useState<ValidationResultType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: IdeaSubmission) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await axios.post('/api/validate-idea', data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 120000, // 2분 타임아웃
      })
      
      setResult(response.data)
    } catch (err: any) {
      console.error('검증 오류:', err)
      
      if (err.code === 'ECONNABORTED') {
        setError('요청 시간이 초과되었습니다. 다시 시도해주세요.')
      } else if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('아이디어 검증 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">🚀 아이디어 검증 AI</h1>
          <p className="text-sm text-gray-600">GPT-4.1 기반 비즈니스 아이디어 분석</p>
        </div>
      </header>

      {/* 에러 메시지 */}
      {error && (
        <div className="mx-6 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <span className="text-red-500 text-xl">⚠️</span>
            <div>
              <div className="font-medium text-red-800">오류가 발생했습니다</div>
              <div className="text-red-700">{error}</div>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 - 좌우 분할 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측 영역 - 입력 폼 (2/5) */}
        <div className="w-2/5 bg-white/50 border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>✍️</span>
              <span>아이디어 입력</span>
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <IdeaForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>

        {/* 우측 영역 - 결과 표시 (3/5) */}
        <div className="w-3/5 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>📊</span>
              <span>분석 결과</span>
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {result ? (
              <div className="p-6">
                <ValidationResult result={result} onReset={handleReset} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center px-6">
                <div className="text-gray-500">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium mb-2">분석 결과가 여기에 표시됩니다</h3>
                  <p className="text-sm">
                    좌측에서 아이디어를 입력하고<br />
                    검증하기 버튼을 클릭해주세요.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-3">
        <div className="text-center text-xs text-gray-500">
          © 2024 아이디어 검증 AI | 본 서비스는 참고용으로 제공되며, 실제 비즈니스 결정 시 전문가와 상담하시기 바랍니다.
        </div>
      </footer>
    </div>
  )
}

export default HomePage 