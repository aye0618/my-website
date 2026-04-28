'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const baseStyles = 'rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
    
    const variants = {
      primary: 'bg-gradient-to-r from-bazi-gold via-bazi-gold-light to-bazi-gold text-bazi-bg border border-bazi-gold/50 shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] hover:-translate-y-0.5 active:translate-y-0',
      secondary: 'bg-bazi-card border border-bazi-border hover:border-bazi-gold active:border-bazi-gold text-bazi-text',
      ghost: 'text-bazi-text hover:text-bazi-gold active:text-bazi-gold',
    }
    
    const sizes = {
      sm: 'px-3 py-2 text-sm sm:px-4',
      md: 'px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base',
      lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
