import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StoryCarousel from '../components/StoryCarousel'
import { loadStories } from '../utils/storyLoader'
import { useLanguage } from '../context/LanguageContext'

const Home = () => {
  const [stories, setStories] = useState([])
  const [mode, setMode] = useState('story')
  const { language } = useLanguage()

  useEffect(() => {
    const fetchStories = async () => {
      const loadedStories = await loadStories()
      setStories(loadedStories)
    }
    fetchStories()
  }, [])

  const translations = {
    en: {
      title: 'Welcome to HIMIG',
      subtitle: 'Folk Stories for Children',
      description: 'Explore wonderful stories and test your knowledge with fun quizzes!',
    },
    fil: {
      title: 'Maligayang Pagdating sa HIMIG',
      subtitle: 'Mga Kuwento para sa mga Bata',
      description: 'Tuklasin ang mga kahanga-hangang kuwento at subukan ang iyong kaalaman sa masayang mga pagsusulit!',
    },
  }

  const t = translations[language] || translations['en']

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Title Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.img
            src="/assets/himig-logo.png"
            alt="HIMIG Logo"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-4 max-w-xs md:max-w-md lg:max-w-lg h-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-body text-2xl text-gray-600 mb-2"
          >
            {t.subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-body text-lg text-gray-500"
          >
            {t.description}
          </motion.p>
        </motion.div>

        {/* Story Carousel */}
        <StoryCarousel stories={stories} mode={mode} onModeChange={setMode} />
      </div>
    </div>
  )
}

export default Home

