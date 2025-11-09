import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StoryPlayer from './StoryPlayer'
import { useLanguage } from '../context/LanguageContext'

const StoryReader = ({ story }) => {
  const { language } = useLanguage()
  const [currentSegment, setCurrentSegment] = useState(null)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const segmentRefs = useRef({})
  const containerRef = useRef(null)

  const chapters = story?.chapters || []
  const segments = chapters.flatMap((chapter) => chapter[language] || chapter['en'] || [])

  // Chunk segments into pages (approximately 3-4 segments per page)
  const pages = useMemo(() => {
    const segmentsPerPage = 4
    const pageChunks = []
    
    for (let i = 0; i < segments.length; i += segmentsPerPage) {
      pageChunks.push(segments.slice(i, i + segmentsPerPage))
    }
    
    return pageChunks
  }, [segments])

  const totalPages = pages.length + 1 // +1 for cover page

  const handleTimeUpdate = (currentTime) => {
    const activeSegment = segments.find(
      (segment) => currentTime >= segment.start && currentTime <= segment.end
    )

    if (activeSegment && activeSegment !== currentSegment) {
      setCurrentSegment(activeSegment)
      
      // Find which page contains this segment
      const segmentIndex = segments.indexOf(activeSegment)
      const pageIndex = Math.floor(segmentIndex / 4) + 1 // +1 because page 0 is cover
      
      if (pageIndex !== currentPage && pageIndex < totalPages) {
        setCurrentPage(pageIndex)
      }
    }
  }

  const handleAudioLoaded = () => {
    setAudioLoaded(true)
  }

  const handlePageTurn = (direction) => {
    if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleClick = (e) => {
    // Don't turn page if clicking on audio button or other interactive elements
    if (e.target.closest('.audio-controls') || e.target.closest('button')) {
      return
    }
    
    const clickX = e.clientX
    const windowWidth = window.innerWidth
    
    // Click left side to go back, right side to go forward
    if (clickX < windowWidth / 2) {
      handlePageTurn('prev')
    } else {
      handlePageTurn('next')
    }
  }

  if (!story) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Story not found</p>
      </div>
    )
  }

  const audioSrc = story.voice?.[language] || story.voice?.['en']

  return (
    <div 
      className="max-w-6xl mx-auto min-h-screen relative cursor-pointer"
      onClick={handleClick}
    >
      {/* Book Page Container */}
      <div className="relative h-[80vh] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentPage === 0 ? (
            // Cover Page
            <motion.div
              key="cover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full max-w-2xl h-full bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center"
            >
              <motion.img
                src={story.cover || '/assets/covers/story1.png'}
                alt={story.title[language] || story.title['en']}
                className="w-full h-auto max-h-[60vh] rounded-xl shadow-xl object-contain mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="512" height="640"%3E%3Crect fill="%23A3D5FF" width="512" height="640"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="24" fill="white"%3E' +
                    (story.title[language] || story.title['en']) +
                    '%3C/text%3E%3C/svg%3E'
                }}
              />
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-title font-bold text-4xl md:text-5xl text-gray-800 text-center"
              >
                {story.title[language] || story.title['en']}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-center mt-4 text-lg"
              >
                {language === 'en' ? 'Click anywhere to start reading' : 'I-click kahit saan para magsimulang magbasa'}
              </motion.p>
            </motion.div>
          ) : (
            // Story Pages
            <motion.div
              key={`page-${currentPage}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full max-w-2xl h-full bg-white rounded-2xl shadow-2xl p-12 flex flex-col"
              style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)' }}
            >
              <div
                ref={containerRef}
                className="flex-1 overflow-y-auto"
              >
                {pages[currentPage - 1]?.map((segment, index) => {
                  const segmentKey = `${segment.start}-${segment.end}`
                  const isActive = currentSegment === segment

                  return (
                    <motion.span
                      key={segmentKey}
                      ref={(el) => (segmentRefs.current[segmentKey] = el)}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: audioLoaded ? 1 : 0.5,
                        backgroundColor: isActive ? '#FFE066' : 'transparent',
                      }}
                      transition={{
                        backgroundColor: { duration: 0.3 },
                        opacity: { duration: 0.5 },
                      }}
                      className={`inline-block px-2 py-1 rounded transition-colors leading-relaxed ${
                        isActive ? 'font-semibold' : ''
                      }`}
                    >
                      {segment.text}
                      {index < pages[currentPage - 1].length - 1 && ' '}
                    </motion.span>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Page Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <span className="text-sm text-gray-700 font-medium">
            {currentPage + 1} / {totalPages}
          </span>
        </div>
      </div>

      {/* Navigation Hints */}
      {currentPage > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-full p-3 shadow-md">
            <span className="text-xs text-gray-600">← Prev</span>
          </div>
        </motion.div>
      )}
      {currentPage < totalPages - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-full p-3 shadow-md">
            <span className="text-xs text-gray-600">Next →</span>
          </div>
        </motion.div>
      )}

      {/* Floating Audio Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 audio-controls" onClick={(e) => e.stopPropagation()}>
        <StoryPlayer
          audioSrc={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoaded={handleAudioLoaded}
          isFloating={true}
        />
      </div>
    </div>
  )
}

export default StoryReader

