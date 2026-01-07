interface PasswordStrengthIndicatorProps {
  password: string
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const getStrength = () => {
    if (!password) return { score: 0, text: '', color: '' }
    if (password.length < 6) {
      return { score: 1, text: 'Weak', color: 'bg-red-500' }
    }
    if (password.length < 8) {
      return { score: 2, text: 'Fair', color: 'bg-orange-500' }
    }
    if (password.length < 10 && !/[A-Z]/.test(password)) {
      return { score: 3, text: 'Good', color: 'bg-yellow-500' }
    }
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
      return { score: 5, text: 'Very Strong', color: 'bg-emerald-600' }
    }
    return { score: 4, text: 'Strong', color: 'bg-blue-600' }
  }

  const strength = getStrength()

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password Strength</span>
        <span className={`text-xs font-bold ${strength.color.replace('bg-', 'text-')}`}>
          {strength.text}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(level => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              strength.score >= level ? strength.color : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      {password.length > 0 && (
        <ul className="text-xs text-slate-500 space-y-1 mt-2">
          <li className={`flex items-center gap-2 ${password.length >= 6 ? 'text-emerald-600' : ''}`}>
            <div className={`w-4 h-4 rounded flex items-center justify-center ${
              password.length >= 6 ? 'bg-emerald-100' : 'bg-slate-100'
            }`}>
              {password.length >= 6 && <span className="text-emerald-600">✓</span>}
            </div>
            At least 6 characters
          </li>
          <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-emerald-600' : ''}`}>
            <div className={`w-4 h-4 rounded flex items-center justify-center ${
              password.length >= 8 ? 'bg-emerald-100' : 'bg-slate-100'
            }`}>
              {password.length >= 8 && <span className="text-emerald-600">✓</span>}
            </div>
            At least 8 characters
          </li>
          <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-emerald-600' : ''}`}>
            <div className={`w-4 h-4 rounded flex items-center justify-center ${
              /[A-Z]/.test(password) ? 'bg-emerald-100' : 'bg-slate-100'
            }`}>
              {/[A-Z]/.test(password) && <span className="text-emerald-600">✓</span>}
            </div>
            Uppercase letter
          </li>
          <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-emerald-600' : ''}`}>
            <div className={`w-4 h-4 rounded flex items-center justify-center ${
              /[0-9]/.test(password) ? 'bg-emerald-100' : 'bg-slate-100'
            }`}>
              {/[0-9]/.test(password) && <span className="text-emerald-600">✓</span>}
            </div>
            Number
          </li>
          <li className={`flex items-center gap-2 ${/[!@#$%^&*]/.test(password) ? 'text-emerald-600' : ''}`}>
            <div className={`w-4 h-4 rounded flex items-center justify-center ${
              /[!@#$%^&*]/.test(password) ? 'bg-emerald-100' : 'bg-slate-100'
            }`}>
              {/[!@#$%^&*]/.test(password) && <span className="text-emerald-600">✓</span>}
            </div>
            Special character
          </li>
        </ul>
      )}
    </div>
  )
}
