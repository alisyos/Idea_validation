import React, { useState } from 'react'
import { IdeaSubmission } from '@/types'

interface IdeaFormProps {
  onSubmit: (data: IdeaSubmission) => void
  isLoading: boolean
}

const IdeaForm: React.FC<IdeaFormProps> = ({ onSubmit, isLoading }) => {
  const [idea, setIdea] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (idea.trim()) {
      onSubmit({ idea: idea.trim() })
    }
  }

  return (
    <div className="h-full">
      <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
        <div className="flex-1 flex flex-col">
          <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
            아이디어 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="아이디어에 대해서 상세하게 기입해주세요. AI가 시장성, 차별성, 리스크를 분석해드립니다."
            className="textarea-field flex-1 min-h-0"
            required
            disabled={isLoading}
          />
          <div className="mt-2 text-sm text-gray-500">
            {idea.length}/2000자 (상세할수록 정확한 분석이 가능합니다)
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || !idea.trim()}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>AI가 분석 중입니다...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>검증하기</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default IdeaForm 