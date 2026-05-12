'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { JOB_CATEGORIES, NIGERIAN_CITIES } from '@/types'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { getInitials } from '@/lib/utils'
import type { User, Job } from '@/types'

function HeroSection({ user, loading }: { user: any; loading: boolean }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <section className="relative overflow-hidden min-h-[90svh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#eef4f2] via-[#f8faf9] to-[#e5efed]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(15,79,74,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,214,102,0.12),transparent_40%)]" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-primary/20 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-primary">Trusted by 10,000+ users</span>
              </div>

              <div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-text-primary">
                  Find trusted <span className="text-brand-primary">skilled professionals</span> for any job
                </h1>
              </div>

              <p className="text-lg sm:text-xl text-text-secondary max-w-lg">
                Clean, fast, and easy to use from your phone. Get quality service delivered.
              </p>

              <form action="/professionals" method="GET" className="flex flex-col sm:flex-row gap-3">
                <div className={`relative flex-1 transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    name="search"
                    placeholder="What service do you need?"
                    className="w-full h-[56px] pl-12 pr-4 rounded-2xl border-2 border-brand-primary/20 bg-white text-text-primary placeholder-text-secondary focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
                <select
                  name="city"
                  className="h-[56px] px-4 rounded-2xl border-2 border-brand-primary/20 bg-white text-text-primary focus:border-brand-primary outline-none transition-all cursor-pointer"
                >
                  <option value="">All cities</option>
                  {NIGERIAN_CITIES.slice(0, 10).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="h-[56px] px-8 rounded-2xl bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-all hover:shadow-lg hover:shadow-brand-primary/20 active:scale-[0.98]"
                >
                  Search
                </button>
              </form>

              {!loading && !user && (
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className="h-[48px] px-6 rounded-2xl bg-brand-primary text-white font-semibold flex items-center justify-center hover:bg-brand-hover transition-all hover:shadow-lg active:scale-[0.98]"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/login"
                    className="h-[48px] px-6 rounded-2xl border-2 border-brand-primary text-brand-primary font-semibold flex items-center justify-center hover:bg-brand-light transition-all active:scale-[0.98]"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 pt-4">
                {[
                  { icon: '\u2713', text: 'Verified Professionals' },
                  { icon: '\u2605', text: '4.9 Average Rating' },
                  { icon: '\u26A1', text: 'Quick Response' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center text-brand-primary text-xs font-bold">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-amber-400/20 rounded-[3rem] blur-3xl scale-90" />
              
              <div className={`relative z-10 transition-all duration-500 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <Image
                  src="/phone-hand.webp"
                  alt="Anywork365 mobile app on phone"
                  width={500}
                  height={650}
                  priority
                  onLoad={() => setImageLoaded(true)}
                  className="w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[480px] h-auto object-contain drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(7, 33, 31, 0.15))',
                  }}
                />
              </div>

              <div className="absolute -left-2 sm:-left-4 top-[15%] z-20 bg-white rounded-2xl shadow-lg p-2 sm:p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Job Completed</p>
                    <p className="text-[10px] text-text-secondary">2 hours ago</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-2 sm:-right-4 bottom-[25%] z-20 bg-white rounded-2xl shadow-lg p-2 sm:p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {['\u2B50', '\u2B50', '\u2B50', '\u2B50', '\u2B50'].map((star, i) => (
                      <span key={i} className="text-sm">{star}</span>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-text-secondary mt-1">4.9/5 from 2k+ reviews</p>
              </div>

              <div className="absolute -left-2 sm:-left-4 bottom-[5%] z-20 bg-white rounded-2xl shadow-lg p-2 sm:p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">500+ Vendors</p>
                    <p className="text-[10px] text-text-secondary">Ready to help</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { user, loading } = useCurrentUser()
  const [vendors, setVendors] = useState<User[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  
  useEffect(() => {
    fetch('/api/professionals?limit=8')
      .then(r => r.json())
      .then(d => { if (d.success) setVendors(d.data) })
      .catch(() => {})
    fetch('/api/jobs?limit=6')
      .then(r => r.json())
      .then(d => { if (d.success) setJobs(d.data) })
      .catch(() => {})
  }, [])
  
  const displayCategories = JOB_CATEGORIES.slice(0, 12)
  const featuredVendors = vendors.slice(0, 8)
  const latestJobs = jobs.slice(0, 6)

  const [favorites, setFavorites] = useState<string[]>([])

  function toggleFavorite(e: React.MouseEvent, vendorId: string) {
    e.preventDefault()
    setFavorites(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    )
  }

  function StarRating({ rating }: { rating: number }) {
    return (
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map((star) => (
          <svg 
            key={star}
            className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.798 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.798-2.034a1 1 0 00-1.175 0l-2.798 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-[#eef4f2] overflow-hidden">
      <HeroSection user={user} loading={loading} />

      <section className="border-t border-[#d5e1de] bg-white/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
                Services
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-text-primary">
                Browse by category
              </h2>
            </div>
            <Link href="/professionals" className="text-sm font-medium text-brand-primary hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {displayCategories.map((service, index) => (
              <Link
                key={service}
                href={`/professionals?category=${encodeURIComponent(service)}`}
                className="flex flex-col items-center justify-center rounded-xl border border-[#cfe0dc] bg-[#f8faf9] p-4 text-center transition-all duration-200 hover:border-brand-primary hover:shadow-md hover:-translate-y-0.5"
              >
                <CategoryIcon category={service} size={48} />
                <span className="text-xs font-medium text-text-primary line-clamp-2 mt-2">{service}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d5e1de] bg-white/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
                Top Vendors
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-text-primary">
                Top Rated Vendors
              </h2>
            </div>
            <Link href="/professionals" className="text-sm font-medium text-brand-primary hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredVendors.map((vendor, index) => (
              <Link
                key={vendor.id}
                href={`/professionals/${vendor.id}`}
                className="card hover:border-brand-primary transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center text-white font-semibold text-lg">
                      {getInitials(vendor.firstName, vendor.lastName)}
                    </div>
                    {vendor.isVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white bg-blue-500">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-text-primary truncate">{vendor.firstName} {vendor.lastName}</h3>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-text-secondary">{vendor.city}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => toggleFavorite(e, vendor.id)}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg 
                      className={`w-5 h-5 ${favorites.includes(vendor.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand-primary">
                    {vendor.skills?.[0]}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <StarRating rating={Math.round(vendor.rating || 4)} />
                  <button 
                    onClick={(e) => { e.preventDefault() }}
                    className="text-sm text-brand-primary hover:underline"
                  >
                    {vendor.reviewCount} reviews
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d5e1de] bg-white/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
                Top Vendors
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-text-primary">
                Find Vendors
              </h2>
            </div>
            <Link href="/professionals" className="text-sm font-medium text-brand-primary hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredVendors.map((vendor, i) => (
              <Link
                key={vendor.id}
                href={`/professionals/${vendor.id}`}
                className="card hover:border-brand-primary transition-all duration-200 hover:-translate-y-0.5 text-center"
              >
                <div className="relative inline-block mb-2">
                  <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-lg font-semibold text-white ${
                    ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500'][i % 6]
                  }`}>
                    {vendor.firstName[0]}{vendor.lastName[0]}
                  </div>
                  {vendor.isVerified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-text-primary text-sm line-clamp-1 mb-1 flex items-center justify-center gap-1">
                  {vendor.firstName} {vendor.lastName}
                  {vendor.isVerified && (
                    <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-1 mb-2">{vendor.city}</p>
                {vendor.rating && (
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <span className="text-amber-500">★</span>
                    <span className="font-medium text-text-primary">{vendor.rating}</span>
                    <span className="text-text-secondary">({vendor.reviewCount})</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d5e1de] bg-white/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
                Career
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-text-primary">
                Browse Jobs
              </h2>
            </div>
            <Link href="/jobs" className="text-sm font-medium text-brand-primary hover:underline">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestJobs.map((job, index) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="card hover:border-brand-primary transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-end gap-2 mb-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    job.jobType === 'full-time' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {job.jobType === 'full-time' ? 'Full-time' : 'Contract'}
                  </span>
                </div>
                <h3 className="font-medium text-text-primary line-clamp-1 mb-1">{job.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-1 mb-2">{job.businessName}</p>
                <div className="flex items-center gap-1 text-xs text-text-secondary mb-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="line-clamp-1">{job.businessAddress}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-ui-border">
                  <span className="text-xs text-text-secondary">
                    Closes: {new Date(job.closingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-xs text-text-secondary">{job.applicationCount} applicants</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}