import React, { useState } from 'react'
import axios from 'axios'
import IdeaForm from '@/components/IdeaForm'
import ValidationResult from '@/components/ValidationResult'
import { ValidationResult as ValidationResultType, IdeaSubmission } from '@/types'
import { generateDocx } from '@/utils/docxGenerator'

const HomePage: React.FC = () => {
  const [result, setResult] = useState<ValidationResultType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentIdea, setCurrentIdea] = useState<string>('')
  const [isDownloading, setIsDownloading] = useState(false)

  const handleSubmit = async (data: IdeaSubmission) => {
    setIsLoading(true)
    setError(null)
    setCurrentIdea(data.idea) // 현재 아이디어 저장
    
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
    setCurrentIdea('')
  }

  const handleDownloadDocx = async () => {
    if (!result || !currentIdea) return
    
    setIsDownloading(true)
    try {
      await generateDocx(result, currentIdea)
    } catch (error) {
      console.error('DOCX 다운로드 오류:', error)
      alert('파일 다운로드 중 오류가 발생했습니다.')
    } finally {
      setIsDownloading(false)
    }
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
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>📊</span>
              <span>분석 결과</span>
            </h2>
            
            {result && (
              <button
                onClick={handleDownloadDocx}
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>생성 중...</span>
                  </>
                ) : (
                  <>
                    <span>📄</span>
                    <span>보고서 다운로드 (DOCX)</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {result ? (
              <div className="p-6">
                <ValidationResult result={result} onReset={handleReset} ideaText={currentIdea} />
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

      {/* 로딩 모달 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            {/* 로딩 스피너 */}
            <div className="mb-6">
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-4">
                  <svg className="animate-spin w-full h-full text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
              </div>
            </div>
            
            {/* 메인 메시지 */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI 분석 진행 중</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              GPT-4.1이 시장 데이터를 실시간으로 검색하고<br />
              아이디어를 종합적으로 분석하고 있습니다
            </p>
            
            {/* 진행 단계 표시 */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-gray-700">시장 정보 수집 중...</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <span className="text-gray-600">경쟁사 분석 중...</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <span className="text-gray-500">종합 보고서 작성 중...</span>
              </div>
            </div>
            
            {/* 애니메이션 점들 */}
            <div className="flex items-center justify-center space-x-1 mb-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            
            {/* 시간 안내 */}
            <p className="text-xs text-gray-400">
              분석에는 보통 30초~2분 정도 소요됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage 