'use client'

import { useState } from 'react'
import { X, Download, Eye } from 'lucide-react'

interface DocumentModalProps {
  isOpen: boolean
  onClose: () => void
  document: {
    title: string
    url: string
    type: string
  } | null
}

export default function DocumentModal({ isOpen, onClose, document }: DocumentModalProps) {
  if (!isOpen || !document) return null

  const handleDownload = () => {
    const link = window.document.createElement('a')
    link.href = document.url
    link.download = `${document.title.replace(/\s+/g, '_')}.html`
    link.target = '_blank'
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-kommo-primary/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-kommo-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
              <p className="text-sm text-gray-500">Document PDF • {document.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Télécharger"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[500px]">
            {document.url.endsWith('.html') ? (
              <iframe
                src={document.url}
                className="w-full h-[600px] rounded-lg border border-gray-200 bg-white"
                title={document.title}
              />
            ) : (
              <iframe
                src={document.url}
                className="w-full h-[600px] rounded-lg border border-gray-200"
                title={document.title}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Document confidentiel • RealtyMatch © 2024
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-kommo-primary text-white text-sm font-medium rounded-lg hover:bg-kommo-secondary transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
