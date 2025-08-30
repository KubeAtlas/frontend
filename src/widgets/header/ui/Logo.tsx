import { RocketIcon, StarFilledIcon } from '@radix-ui/react-icons'

export const Logo = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative shadow-2xl">
        <RocketIcon className="w-10 h-10 text-white" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-xl animate-pulse" />
      </div>
      
      <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        KubeAtlas
      </h1>
      
      <p className="text-gray-300 text-lg font-light mb-4">
        Центр управления кластером
      </p>
      
      <div className="flex justify-center space-x-1">
        {[...Array(3)].map((_, i) => (
          <StarFilledIcon 
            key={i}
            className="w-4 h-4 text-yellow-400 animate-pulse" 
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>
    </div>
  )
}
