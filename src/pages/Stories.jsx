import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import StoryReader from '../components/StoryReader'
import Quiz from '../components/Quiz'
import { getStoryById, loadStories } from '../utils/storyLoader'
import { ArrowLeft, BookOpen, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const Stories = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()
  const isQuizMode = location.pathname.includes('/quiz')

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        // Load specific story
        const loadedStory = await getStoryById(id)
        setStory(loadedStory)
        setLoading(false)
      } else {
        // Load all stories for listing
        const loadedStories = await loadStories()
        setStories(loadedStories)
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const translations = {
    en: {
      back: 'Back to Home',
      title: 'Available Stories',
      subtitle: 'Choose a story to read',
      readStory: 'Read Story',
      takeQuiz: 'Take Quiz',
    },
    fil: {
      back: 'Bumalik sa Home',
      title: 'Mga Available na Kuwento',
      subtitle: 'Pumili ng kuwento na babasahin',
      readStory: 'Basahin ang Kuwento',
      takeQuiz: 'Kumuha ng Quiz',
    },
  }

  const t = translations[language] || translations['en']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-sky-blue border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // Show story list if no id
  if (!id) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 mb-6 text-gray-700 hover:text-sky-blue transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-body font-semibold">{t.back}</span>
          </motion.button>

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-title font-bold text-4xl md:text-5xl text-gray-800 mb-4">
              {t.title}
            </h1>
            <p className="font-body text-xl text-gray-600">
              {t.subtitle}
            </p>
          </motion.div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((storyItem, index) => (
              <motion.div
                key={storyItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* Story Cover */}
                <div className="relative h-64 overflow-hidden">
                  {storyItem.cover ? (
                    <img
                      src={storyItem.cover}
                      alt={storyItem.title[language] || storyItem.title['en']}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="512" height="640"%3E%3Crect fill="%23A3D5FF" width="512" height="640"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="24" fill="white"%3E' +
                          (storyItem.title[language] || storyItem.title['en']) +
                          '%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-sky-blue flex items-center justify-center">
                      <BookOpen size={64} className="text-white" />
                    </div>
                  )}
                  
                  {storyItem.comingSoon && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-title font-bold text-gray-700">
                        {storyItem.title[language] || storyItem.title['en']}
                      </span>
                    </div>
                  )}
                </div>

                {/* Story Info */}
                <div className="p-6">
                  <h3 className="font-title font-bold text-2xl text-gray-800 mb-4">
                    {storyItem.title[language] || storyItem.title['en']}
                  </h3>

                  {!storyItem.comingSoon && (
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => navigate(`/stories/${storyItem.id}`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-sky-blue text-white px-4 py-2 rounded-full font-title font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                      >
                        <BookOpen size={18} />
                        {t.readStory}
                      </motion.button>
                      <motion.button
                        onClick={() => navigate(`/stories/${storyItem.id}/quiz`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-sunshine-yellow text-white px-4 py-2 rounded-full font-title font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                      >
                        <Play size={18} />
                        {t.takeQuiz}
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show story reader or quiz if id exists
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/stories')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-sky-blue transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-body font-semibold">{t.back}</span>
        </motion.button>

        {/* Story Reader or Quiz */}
        {isQuizMode ? (
          <Quiz story={story} />
        ) : (
          <StoryReader story={story} />
        )}
      </div>
    </div>
  )
}

export default Stories

