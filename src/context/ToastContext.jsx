'use client';
import { createContext, useContext, useState, useEffect} from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    message: '',
    visible: false,
    type: 'info',
    isLeaving: false,
    isEntering: false
  })

  const showToast = (message, type = 'info') => {
    setToast({ 
      message, 
      visible: true, 
      type, 
      isLeaving: false, 
      isEntering: true 
    })
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, isEntering: false }))
    }, 300)
  }

  useEffect(() => {
    let timeoutId;
    if (toast.visible && !toast.isLeaving && !toast.isEntering) {
      timeoutId = setTimeout(() => {
        setToast(prev => ({ ...prev, isLeaving: true }))
        
        setTimeout(() => {
          setToast(prev => ({ ...prev, visible: false }))
        }, 300)
      }, 3000)
    }
    return () => clearTimeout(timeoutId)
  }, [toast.visible, toast.isLeaving, toast.isEntering])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <div 
          style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            backgroundColor: 
              toast.type === 'success' ? '#22c55e' : 
              toast.type === 'error' ? '#ef4444' : 
              toast.type === 'warning' ? '#eab308' : 
              '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 9999,
            opacity: toast.isLeaving ? 0 : toast.isEntering ? 0 : 1,
            transition: 'all 300ms ease-in-out',
            transform: toast.isLeaving 
              ? 'translateX(-50%) translateY(-10px)'
              : toast.isEntering 
                ? 'translateX(-50%) translateY(10px)'
                : 'translateX(-50%) translateY(0)',
          }}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => {

  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}