'use client'

import { Modal, Button } from './CommonUI'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'DELETE',
  cancelText = 'CANCEL',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title.toUpperCase()}>
      <div className="space-y-6">
        <p className="text-white text-xs leading-relaxed font-pixel border-2 border-white p-4 bg-black">
          {message.toUpperCase()}
        </p>
        
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {cancelText.toUpperCase()}
          </Button>
          <Button 
            variant="secondary"
            onClick={handleConfirm}
            className="flex-1 border-2 border-white bg-black text-white hover:bg-white hover:text-black"
          >
            {confirmText.toUpperCase()}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
