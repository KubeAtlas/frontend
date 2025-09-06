/**
 * Хук для работы с глобальной системой z-index
 * Обеспечивает консистентность слоев во всем приложении
 */

export type ZIndexLayer = 
  | 'background'
  | 'content' 
  | 'sidebar'
  | 'header'
  | 'dropdown'
  | 'dropdown-overlay'
  | 'modal'
  | 'modal-overlay'
  | 'toast'
  | 'tooltip'

export const useZIndex = () => {
  const getZIndex = (layer: ZIndexLayer): number => {
    const zIndexMap: Record<ZIndexLayer, number> = {
      'background': 0,
      'content': 10,
      'sidebar': 20,
      'header': 30,
      'dropdown': 1000,
      'dropdown-overlay': 999,
      'modal': 2000,
      'modal-overlay': 1999,
      'toast': 3000,
      'tooltip': 1500,
    }
    
    return zIndexMap[layer]
  }

  const getZIndexStyle = (layer: ZIndexLayer) => ({
    zIndex: getZIndex(layer)
  })

  const getZIndexClass = (layer: ZIndexLayer) => `z-${layer}`

  return {
    getZIndex,
    getZIndexStyle,
    getZIndexClass,
    layers: {
      background: 'background' as const,
      content: 'content' as const,
      sidebar: 'sidebar' as const,
      header: 'header' as const,
      dropdown: 'dropdown' as const,
      dropdownOverlay: 'dropdown-overlay' as const,
      modal: 'modal' as const,
      modalOverlay: 'modal-overlay' as const,
      toast: 'toast' as const,
      tooltip: 'tooltip' as const,
    }
  }
}

export default useZIndex
