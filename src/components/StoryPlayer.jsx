import React, { useRef, useEffect, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

const StoryPlayer = ({ audioSrc, onTimeUpdate, onLoaded, isCompact = false, isFloating = false }) => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      const time = audio.currentTime
      setCurrentTime(time)
      if (onTimeUpdate) {
        onTimeUpdate(time)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      if (onLoaded) {
        onLoaded()
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onTimeUpdate, onLoaded])

  useEffect(() => {
    if (audioSrc) {
      const audio = audioRef.current
      if (audio) {
        audio.load()
      }
    }
  }, [audioSrc])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (isFloating) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="group bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/30 hover:bg-white/40 hover:border-white/50 transition-all duration-300"
      >
        <audio ref={audioRef} src={audioSrc} preload="metadata" />
        
        <div className="flex items-center gap-2 p-3">
          <motion.button
            onClick={togglePlayPause}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-sky-blue/80 group-hover:bg-sky-blue text-white rounded-full p-2.5 shadow-md hover:shadow-lg transition-all duration-300"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </motion.button>

          <motion.button
            onClick={toggleMute}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white/70 group-hover:text-white transition-colors duration-300 p-1.5"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </motion.button>

          {/* Compact Progress Bar */}
          <div className="flex-1 min-w-[80px] max-w-[120px]">
            <div className="h-1 bg-white/20 group-hover:bg-white/30 rounded-full overflow-hidden transition-colors duration-300">
              <motion.div
                className="h-full bg-sky-blue"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          <span className="text-xs text-white/70 group-hover:text-white font-medium min-w-[35px] transition-colors duration-300">
            {formatTime(currentTime)}
          </span>
        </div>
      </motion.div>
    )
  }

  if (isCompact) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50">
        <audio ref={audioRef} src={audioSrc} preload="metadata" />
        
        <div className="flex items-center gap-2 p-2">
          <motion.button
            onClick={togglePlayPause}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-sky-blue text-white rounded-full p-2.5 shadow-md hover:shadow-lg transition-shadow"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </motion.button>

          <motion.button
            onClick={toggleMute}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-600 hover:text-sky-blue transition-colors p-1.5"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </motion.button>

          {/* Compact Progress Bar */}
          <div className="flex-1 min-w-[80px] max-w-[120px]">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-sky-blue"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          <span className="text-xs text-gray-500 font-medium min-w-[35px]">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-sky-blue"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          onClick={togglePlayPause}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-sky-blue text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </motion.button>

        <motion.button
          onClick={toggleMute}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-600 hover:text-sky-blue transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </motion.button>
      </div>
    </div>
  )
}

export default StoryPlayer

