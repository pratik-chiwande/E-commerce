'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid'
import { useAuth } from '../../../Context/AuthContext'
import { useTheme } from '../../../Context/ThemeContext'

// Password strength calculator
function getStrength(pwd) {
  let score = 0
  if (pwd.length >= 6)  score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/\d/.test(pwd))    score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score
}
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
const strengthColor = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-500']

function InputField({ label, icon: Icon, type = 'text', value, onChange, error, placeholder, right, isDark }) {
  return (
    <div>
      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Icon className={`h-4 w-4 ${error ? 'text-red-400' : isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pl-9 ${right ? 'pr-10' : 'pr-3'} py-3 rounded-xl text-sm border transition focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-400 focus:ring-red-300'
              : isDark
                ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-indigo-400 focus:border-indigo-400'
          }`}
        />
        {right && (
          <div className="absolute inset-y-0 right-3 flex items-center">{right}</div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <ExclamationCircleIcon className="h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  )
}

const perks = [
  'Free delivery on orders above ₹499',
  'Exclusive member-only deals',
  'Easy 30-day returns',
  'Priority customer support',
]

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { isDark } = useTheme()

  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' })
  const [showPass, setShowPass]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors]         = useState({})
  const [apiError, setApiError]     = useState('')
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)
  const [agreed, setAgreed]         = useState(false)

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const strength = getStrength(form.password)

  const validate = () => {
    const e = {}
    if (!form.name.trim())                          e.name    = 'Full name is required'
    else if (form.name.trim().length < 2)           e.name    = 'Name must be at least 2 characters'

    if (!form.email.trim())                         e.email   = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'

    if (!form.mobile.trim())                        e.mobile  = 'Mobile number is required'
    else if (!/^\d{10}$/.test(form.mobile))         e.mobile  = 'Enter a valid 10-digit mobile number'

    if (!form.password)                             e.password = 'Password is required'
    else if (form.password.length < 6)              e.password = 'Password must be at least 6 characters'

    if (!form.confirm)                              e.confirm  = 'Please confirm your password'
    else if (form.confirm !== form.password)        e.confirm  = 'Passwords do not match'

    if (!agreed) e.agreed = 'You must agree to the terms to continue'

    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setApiError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const result = register({ name: form.name, email: form.email, mobile: form.mobile, password: form.password })
    setLoading(false)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => navigate('/profile'), 2000)
    } else {
      setApiError(result.error || 'Something went wrong. Please try again.')
    }
  }

  // ── SUCCESS SCREEN ──
  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 transition-colors ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className={`text-center max-w-sm w-full p-10 rounded-3xl shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckSolid className="h-9 w-9 text-green-500" />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome, {form.name.split(' ')[0]}! 🎉</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your account is ready. Redirecting to your profile…</p>
          <div className="mt-6 h-1 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full animate-[grow_2s_linear_forwards]" style={{ width: '100%', animation: 'none', transition: 'width 2s linear' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-linear-to-br from-indigo-700 via-indigo-600 to-purple-600 flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 -left-10 w-48 h-48 bg-indigo-300 rounded-full blur-3xl opacity-20" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 bg-black/20 px-4 py-2.5 rounded-2xl w-fit backdrop-blur-sm">
          <svg viewBox="0 0 56 56" className="w-9 h-9">
            <polygon points="28,4 52,28 28,52 4,28" fill="none" stroke="#C9A84C" strokeWidth="1.5" />
            <polygon points="28,14 42,28 28,42 14,28" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
            <rect x="20" y="24" width="16" height="2" fill="#C9A84C" />
            <rect x="27" y="26" width="2" height="14" fill="#C9A84C" />
          </svg>
          <div>
            <p style={{ fontFamily: 'Georgia, serif', color: '#C9A84C', fontSize: 18, letterSpacing: 2 }}>TrendKart</p>
            <p style={{ fontSize: 7, color: '#C9A84C', letterSpacing: 5 }}>LUXURY FASHION</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative space-y-6">
          <div className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-white/80 text-xs font-semibold tracking-wide">Join 2 million+ shoppers</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Dress to<br />impress.
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Create your free account and unlock access to thousands of brands, exclusive deals, and a wardrobe that tells your story.
          </p>

          {/* Perks */}
          <ul className="space-y-3 pt-2">
            {perks.map(perk => (
              <li key={perk} className="flex items-center gap-2.5 text-white/80 text-sm">
                <CheckCircleIcon className="h-4 w-4 text-green-400 shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom badge */}
        <div className="relative flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-white/40" />
          <p className="text-white/40 text-xs">Your data is encrypted and never shared</p>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className={`flex-1 flex items-start justify-center px-5 py-10 overflow-y-auto`}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <div className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-xl">
              <svg viewBox="0 0 56 56" className="w-8 h-8">
                <polygon points="28,4 52,28 28,52 4,28" fill="none" stroke="#C9A84C" strokeWidth="1.5" />
                <rect x="20" y="24" width="16" height="2" fill="#C9A84C" />
                <rect x="27" y="26" width="2" height="14" fill="#C9A84C" />
              </svg>
              <p style={{ fontFamily: 'Georgia, serif', color: '#C9A84C', fontSize: 16, letterSpacing: 2 }}>TrendKart</p>
            </div>
          </div>

          <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Create account</h2>
          <p className={`text-sm mb-7 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-500 font-semibold hover:text-indigo-400 transition">
              Sign in →
            </Link>
          </p>

          {/* API error */}
          {apiError && (
            <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-400/30 text-red-500 text-sm px-4 py-3 rounded-xl">
              <ExclamationCircleIcon className="h-4 w-4 shrink-0" />
              {apiError}
            </div>
          )}

          <div className="space-y-4">

            {/* Full Name */}
            <InputField
              label="Full Name"
              icon={UserIcon}
              value={form.name}
              onChange={set('name')}
              error={errors.name}
              placeholder="Rahul Sharma"
              isDark={isDark}
            />

            {/* Email */}
            <InputField
              label="Email address"
              icon={EnvelopeIcon}
              type="email"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              placeholder="you@example.com"
              isDark={isDark}
            />

            {/* Mobile */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-3 rounded-xl border text-sm font-semibold shrink-0 ${isDark ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                  🇮🇳 +91
                </div>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <DevicePhoneMobileIcon className={`h-4 w-4 ${errors.mobile ? 'text-red-400' : isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={set('mobile')}
                    placeholder="10-digit number"
                    maxLength={10}
                    className={`w-full pl-9 pr-3 py-3 rounded-xl text-sm border transition focus:outline-none focus:ring-2 ${
                      errors.mobile
                        ? 'border-red-400 focus:ring-red-300'
                        : isDark
                          ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                          : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-indigo-400 focus:border-indigo-400'
                    }`}
                  />
                </div>
              </div>
              {errors.mobile && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <ExclamationCircleIcon className="h-3.5 w-3.5 shrink-0" /> {errors.mobile}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <InputField
                label="Password"
                icon={LockClosedIcon}
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                error={errors.password}
                placeholder="Min. 6 characters"
                isDark={isDark}
                right={
                  <button onClick={() => setShowPass(p => !p)} className={isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}>
                    {showPass ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                }
              />
              {/* Strength meter */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Strength: <span className="font-semibold">{strengthLabel[strength]}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <InputField
              label="Confirm Password"
              icon={LockClosedIcon}
              type={showConfirm ? 'text' : 'password'}
              value={form.confirm}
              onChange={set('confirm')}
              error={errors.confirm}
              placeholder="Re-enter your password"
              isDark={isDark}
              right={
                <button onClick={() => setShowConfirm(p => !p)} className={isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}>
                  {showConfirm ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              }
            />

            {/* Password match tick */}
            {form.confirm && form.confirm === form.password && (
              <div className="flex items-center gap-1.5 text-green-500 text-xs -mt-2">
                <CheckSolid className="h-4 w-4" /> Passwords match
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="mt-5">
            <button
              onClick={() => { setAgreed(p => !p); setErrors(e => ({ ...e, agreed: '' })) }}
              className="flex items-start gap-3 w-full text-left"
            >
              <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                agreed
                  ? 'bg-indigo-600 border-indigo-600'
                  : errors.agreed
                    ? 'border-red-400'
                    : isDark ? 'border-gray-600' : 'border-gray-300'
              }`}>
                {agreed && <CheckIcon className="h-3 w-3 text-white" />}
              </div>
              <span className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                I agree to TrendKart's{' '}
                <span className="text-indigo-500 cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-indigo-500 cursor-pointer">Privacy Policy</span>
              </span>
            </button>
            {errors.agreed && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1 ml-8">
                <ExclamationCircleIcon className="h-3.5 w-3.5 shrink-0" /> {errors.agreed}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating account…
              </>
            ) : 'Create account →'}
          </button>

          {/* Divider + social */}
          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
            <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>or sign up with</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { name: 'Google', icon: (
                <svg viewBox="0 0 24 24" className="h-4 w-4">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )},
              { name: 'Facebook', icon: (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )},
            ].map(social => (
              <button
                key={social.name}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition ${
                  isDark
                    ? 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {social.icon}
                {social.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Missing import fix
function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}
