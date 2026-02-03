import { useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// SafeIcon Component - handles all Lucide icons safely
function SafeIcon({ name, size = 24, className, ...props }) {
  const [Icon, setIcon] = useState(null)
  
  useEffect(() => {
    import('lucide-react').then((icons) => {
      const iconName = name
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
      
      const LucideIcon = icons[iconName] || icons.HelpCircle
      setIcon(() => LucideIcon)
    })
  }, [name])
  
  if (!Icon) return <div style={{ width: size, height: size }} className={className} />
  
  return <Icon size={size} className={className} {...props} />
}

// Animated counter component for TVL stats
function AnimatedCounter({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (!isInView) return
    
    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])
  
  return <span ref={ref}>{count}{suffix}</span>
}

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const navLinks = [
    { href: '#home', label: 'Главная' },
    { href: '#about', label: 'О протоколе' },
    { href: '#start', label: 'Как начать' },
  ]
  
  const scrollToSection = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50' : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto max-w-7xl px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <SafeIcon name="hexagon" className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">DeFi<span className="text-blue-400">Pro</span></span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25">
            Подключить кошелек
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <SafeIcon name={isMobileMenuOpen ? 'x' : 'menu'} className="w-6 h-6" />
        </button>
      </nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-slate-300 hover:text-white transition-colors font-medium py-2"
                >
                  {link.label}
                </a>
              ))}
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold w-full">
                Подключить кошелек
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-slate-300">Протокол работает в основной сети</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-tight">
              Децентрализованные{' '}
              <span className="text-gradient">финансы</span>{' '}
              будущего
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Протокол нового поколения для максимальной эффективности ваших активов. 
              Безопасно, прозрачно, без посредников.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Попробовать
                <SafeIcon name="arrow-right" className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all border border-slate-700 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <SafeIcon name="book-open" className="w-5 h-5" />
                Документация
              </motion.button>
            </div>
          </motion.div>
          
          {/* Stats row */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                $<AnimatedCounter end={100} suffix="M+" />
              </div>
              <div className="text-slate-500 text-sm">TVL</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                <AnimatedCounter end={50} suffix="K+" />
              </div>
              <div className="text-slate-500 text-sm">Пользователей</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                <AnimatedCounter end={1} suffix="M+" />
              </div>
              <div className="text-slate-500 text-sm">Транзакций</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                <AnimatedCounter end={99} suffix="%" />
              </div>
              <div className="text-slate-500 text-sm">Безопасность</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Features Section
function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const features = [
    {
      icon: 'globe',
      title: 'Децентрализация',
      description: 'Полный контроль над вашими активами без посредников. Никаких банков, только вы и блокчейн.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'trending-down',
      title: 'Низкие комиссии',
      description: 'Минимальные затраты на транзакции благодаря оптимизированным смарт-контрактам Layer 2.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'shield-check',
      title: 'Безопасность',
      description: 'Аудированные контракты CertiK и многоуровневая защита средств. Ваши активы под надежной защитой.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'trending-up',
      title: 'Высокая доходность',
      description: 'Получайте доход от предоставления ликвидности, стейкинга и фарминга с конкурентными APY.',
      color: 'from-orange-500 to-red-500'
    }
  ]
  
  return (
    <section id="about" className="py-20 lg:py-32 relative" ref={ref}>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Почему выбирают <span className="text-gradient">DeFiPro</span>
          </h2>
          <p className="text-lg text-slate-400">
            Мы создали протокол, который объединяет лучшие практики DeFi с интуитивно понятным интерфейсом
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className={cn("w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6", feature.color)}>
                <SafeIcon name={feature.icon} className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How to Start Section
function HowToStartSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const steps = [
    {
      number: '01',
      title: 'Подключите кошелек',
      description: 'Поддерживаем MetaMask, WalletConnect, Coinbase Wallet и другие популярные кошельки.'
    },
    {
      number: '02',
      title: 'Выберите стратегию',
      description: 'Стейкинг, ликвидность или фарминг — выберите подходящий вариант для ваших целей.'
    },
    {
      number: '03',
      title: 'Начните зарабатывать',
      description: 'Получайте пассивный доход в реальном времени с прозрачной статистикой.'
    }
  ]
  
  return (
    <section id="start" className="py-20 lg:py-32 bg-slate-900/30" ref={ref}>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Как <span className="text-gradient">начать</span>
          </h2>
          <p className="text-lg text-slate-400">
            Начните использовать DeFiPro всего за три простых шага
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <div className="text-6xl font-black text-slate-800 mb-4">{step.number}</div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-slate-700 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Присоединяйтесь к тысячам пользователей, которые уже зарабатывают с DeFiPro. 
              Начните с бонусом для новых пользователей.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-12 py-5 rounded-xl text-xl font-bold transition-all shadow-lg shadow-blue-500/25 inline-flex items-center gap-2"
            >
              Начать сейчас
              <SafeIcon name="arrow-right" className="w-6 h-6" />
            </motion.button>
            
            <p className="mt-6 text-sm text-slate-500">
              Нет комиссий для первых 1000 пользователей
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  const socialLinks = [
    { icon: 'twitter', href: '#', label: 'Twitter' },
    { icon: 'github', href: '#', label: 'GitHub' },
    { icon: 'send', href: '#', label: 'Telegram' },
    { icon: 'message-circle', href: '#', label: 'Discord' }
  ]
  
  const footerLinks = [
    {
      title: 'Продукт',
      links: ['Обмен', 'Стейкинг', 'Фарминг', 'Пулы ликвидности']
    },
    {
      title: 'Разработчикам',
      links: ['Документация', 'API', 'GitHub', 'Bug Bounty']
    },
    {
      title: 'Компания',
      links: ['О нас', 'Блог', 'Карьера', 'Контакты']
    }
  ]
  
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <SafeIcon name="hexagon" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">DeFi<span className="text-blue-400">Pro</span></span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              Децентрализованный финансовый протокол нового поколения. 
              Безопасность, прозрачность и высокая доходность.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
                >
                  <SafeIcon name={social.icon} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-semibold mb-4">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 DeFiPro. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowToStartSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default App