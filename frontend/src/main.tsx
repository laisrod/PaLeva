import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './css/shared/index.css'

// Aguardar o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReact)
} else {
  initReact()
}

function initReact() {
  const rootElement = document.getElementById('root')

  if (rootElement) {
    // Limpar qualquer conteúdo existente do root
    rootElement.innerHTML = ''
    
    // Remover qualquer conteúdo do backend que esteja fora do #root
    // (formulários, divs, etc. que o Rails pode estar injetando)
    const bodyChildren = Array.from(document.body.children)
    bodyChildren.forEach((child) => {
      if (child !== rootElement && child.tagName !== 'SCRIPT') {
        child.remove()
      }
    })
    
    try {
      const root = createRoot(rootElement)
      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      )
      
      // Limpeza periódica para remover conteúdo do backend que possa ser injetado
      setTimeout(() => {
        const bodyChildren = Array.from(document.body.children)
        bodyChildren.forEach((child) => {
          if (child !== rootElement && child.tagName !== 'SCRIPT') {
            child.remove()
          }
        })
      }, 1000)
      
      // Observar mudanças no DOM e remover conteúdo do backend
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node !== rootElement && node.tagName !== 'SCRIPT') {
              // Verificar se o nó está fora do root
              if (!rootElement.contains(node) && document.body.contains(node)) {
                node.remove()
              }
            }
          })
        })
      })
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
    } catch (error) {
      console.error('Erro ao renderizar React:', error)
    }
  } else {
    console.error('ERRO: Elemento #root não encontrado!')
  }
}

