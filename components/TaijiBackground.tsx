export default function TaijiBackground() {
  // 八卦符号：乾、坤、震、巽、坎、离、艮、兑
  const bagua = ['☰', '☷', '☳', '☴', '☵', '☲', '☶', '☱']

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 animate-spin-slow">
        {/* 标准太极图 SVG */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 外圆边框 */}
          <circle
            cx="100"
            cy="100"
            r="99"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-bazi-gold/50"
          />
          
          {/* 整个圆的背景 - 白色 */}
          <circle cx="100" cy="100" r="98" fill="white" />
          
          {/* 黑色的 S 形区域 */}
          <path
            d="M 100,2 
               A 98,98 0 0,0 100,198
               A 49,49 0 0,0 100,100
               A 49,49 0 0,1 100,2 Z"
            fill="#1a1a1a"
          />
          
          {/* 上方（黑色区域中）- 白色大圆 + 黑色小圆 */}
          <circle cx="100" cy="50" r="20" fill="white" />
          <circle cx="100" cy="50" r="8" fill="#1a1a1a" />
          
          {/* 下方（白色区域中）- 黑色大圆 + 白色小圆 */}
          <circle cx="100" cy="150" r="20" fill="#1a1a1a" />
          <circle cx="100" cy="150" r="8" fill="white" />
        </svg>
        
        {/* 八卦符号环绕 */}
        <div className="absolute inset-0">
          {bagua.map((symbol, i) => {
            const angle = i * 45
            const radian = (angle * Math.PI) / 180
            const radius = 420
            const x = Math.cos(radian) * radius
            const y = Math.sin(radian) * radius
            
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 text-bazi-gold/50 text-4xl font-bold select-none"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                {symbol}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
