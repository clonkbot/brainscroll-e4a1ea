import { useState, useEffect, useRef, useCallback } from 'react'

// Types
type ChallengeType = 'pattern' | 'physics' | 'logic' | 'spatial' | 'sequence'

interface Challenge {
  id: number
  type: ChallengeType
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  visual: React.ReactNode
}

// Challenge data generator
const generateChallenges = (): Challenge[] => [
  {
    id: 1,
    type: 'pattern',
    question: 'Which shape completes the sequence?',
    options: ['▲', '●', '■', '◆'],
    correctIndex: 1,
    explanation: 'The pattern alternates: triangle, circle, square, triangle, circle...',
    difficulty: 'easy',
    visual: <PatternVisual sequence={['▲', '●', '■', '▲', '?']} />
  },
  {
    id: 2,
    type: 'physics',
    question: 'Which ball hits the ground first?',
    options: ['Heavy ball', 'Light ball', 'Same time', 'Neither'],
    correctIndex: 2,
    explanation: 'In a vacuum, all objects fall at the same rate regardless of mass (9.8 m/s²)',
    difficulty: 'medium',
    visual: <PhysicsVisual type="falling" />
  },
  {
    id: 3,
    type: 'logic',
    question: 'If A → B and B → C, what can we conclude?',
    options: ['C → A', 'A → C', 'B → A', 'Nothing'],
    correctIndex: 1,
    explanation: 'Transitive property: If A implies B, and B implies C, then A implies C',
    difficulty: 'medium',
    visual: <LogicVisual />
  },
  {
    id: 4,
    type: 'spatial',
    question: 'How many cubes are in this structure?',
    options: ['6', '7', '8', '9'],
    correctIndex: 2,
    explanation: 'Count visible cubes (5) plus hidden cubes behind them (3) = 8 total',
    difficulty: 'hard',
    visual: <SpatialVisual type="cubes" />
  },
  {
    id: 5,
    type: 'sequence',
    question: 'What comes next: 2, 6, 12, 20, ?',
    options: ['28', '30', '32', '36'],
    correctIndex: 1,
    explanation: 'Pattern: n×(n+1) where n=1,2,3,4,5... So 5×6 = 30',
    difficulty: 'hard',
    visual: <SequenceVisual numbers={[2, 6, 12, 20, '?']} />
  },
  {
    id: 6,
    type: 'pattern',
    question: 'Which color comes next?',
    options: ['Red', 'Blue', 'Green', 'Yellow'],
    correctIndex: 2,
    explanation: 'RGB pattern repeats: Red, Blue, Green, Red, Blue, Green...',
    difficulty: 'easy',
    visual: <ColorPatternVisual />
  },
  {
    id: 7,
    type: 'physics',
    question: 'Which path does the ball take when released?',
    options: ['Straight down', 'Curved forward', 'Backward', 'Spiral'],
    correctIndex: 1,
    explanation: 'The ball retains horizontal momentum, creating a parabolic trajectory',
    difficulty: 'medium',
    visual: <PhysicsVisual type="projectile" />
  },
  {
    id: 8,
    type: 'logic',
    question: 'All cats are animals. Some animals are pets. Therefore...',
    options: ['All cats are pets', 'Some cats might be pets', 'No cats are pets', 'All pets are cats'],
    correctIndex: 1,
    explanation: 'We can only conclude possibility, not certainty, from "some" statements',
    difficulty: 'hard',
    visual: <VennVisual />
  },
  {
    id: 9,
    type: 'spatial',
    question: 'If you fold this net, what shape do you get?',
    options: ['Cube', 'Pyramid', 'Prism', 'Cylinder'],
    correctIndex: 0,
    explanation: 'This is a standard cube net - 6 connected squares that fold into a cube',
    difficulty: 'medium',
    visual: <SpatialVisual type="net" />
  },
  {
    id: 10,
    type: 'sequence',
    question: 'What comes next: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '12', '13', '15'],
    correctIndex: 2,
    explanation: 'Fibonacci sequence: each number is the sum of the two preceding ones (5+8=13)',
    difficulty: 'easy',
    visual: <SequenceVisual numbers={[1, 1, 2, 3, 5, 8, '?']} />
  },
  {
    id: 11,
    type: 'pattern',
    question: 'Find the odd one out',
    options: ['2, 4, 6', '3, 6, 9', '5, 10, 12', '7, 14, 21'],
    correctIndex: 2,
    explanation: 'All others multiply by 2 then 3. 5×2=10, but 10×1.2≠12 (should be 15)',
    difficulty: 'hard',
    visual: <OddOneOutVisual />
  },
  {
    id: 12,
    type: 'physics',
    question: 'A pendulum swings. Where is it moving fastest?',
    options: ['Top left', 'Top right', 'Bottom center', 'All same'],
    correctIndex: 2,
    explanation: 'Potential energy converts to kinetic energy - maximum speed at lowest point',
    difficulty: 'medium',
    visual: <PhysicsVisual type="pendulum" />
  },
]

// Visual Components
function PatternVisual({ sequence }: { sequence: string[] }) {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-6 py-8">
      {sequence.map((item, i) => (
        <div
          key={i}
          className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-4xl font-bold rounded-lg
            ${item === '?' ? 'bg-cyber-cyan/20 border-2 border-dashed border-cyber-cyan text-cyber-cyan animate-pulse-glow' : 'bg-white/10 text-white/80'}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

function PhysicsVisual({ type }: { type: 'falling' | 'projectile' | 'pendulum' }) {
  if (type === 'falling') {
    return (
      <div className="relative h-48 md:h-64 flex items-start justify-center gap-16 md:gap-24 pt-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyber-pink to-cyber-purple animate-float"
               style={{ animationDuration: '1.5s' }} />
          <span className="mt-2 text-xs text-white/50 font-mono">10 kg</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-blue-500 animate-float"
               style={{ animationDuration: '1.5s' }} />
          <span className="mt-2 text-xs text-white/50 font-mono">1 kg</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/30 font-mono">GROUND</div>
      </div>
    )
  }
  if (type === 'projectile') {
    return (
      <div className="relative h-48 md:h-64 flex items-center justify-center">
        <svg viewBox="0 0 200 150" className="w-full max-w-xs">
          <defs>
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <line x1="20" y1="130" x2="180" y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <rect x="15" y="50" width="30" height="80" fill="rgba(255,255,255,0.1)" rx="2" />
          <circle cx="30" cy="50" r="12" fill="url(#pathGrad)" className="animate-float" style={{ animationDuration: '2s' }}>
            <animate attributeName="cx" values="30;30" dur="2s" repeatCount="indefinite" />
          </circle>
          <path d="M 30 50 Q 80 20 130 80" stroke="url(#pathGrad)" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.5" />
          <text x="100" y="145" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle" fontFamily="Space Mono">?</text>
        </svg>
      </div>
    )
  }
  return (
    <div className="relative h-48 md:h-64 flex items-start justify-center pt-4">
      <svg viewBox="0 0 200 180" className="w-full max-w-xs">
        <line x1="100" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.5)" strokeWidth="4" />
        <line x1="100" y1="10" x2="40" y2="100" stroke="rgba(0,245,255,0.4)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="100" y1="10" x2="160" y2="100" stroke="rgba(0,245,255,0.4)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="100" y1="10" x2="100" y2="120" stroke="rgba(0,245,255,0.6)" strokeWidth="2" />
        <circle cx="40" cy="100" r="15" fill="rgba(255,0,110,0.3)" stroke="#ff006e" strokeWidth="2" />
        <circle cx="160" cy="100" r="15" fill="rgba(255,0,110,0.3)" stroke="#ff006e" strokeWidth="2" />
        <circle cx="100" cy="120" r="15" fill="rgba(57,255,20,0.3)" stroke="#39ff14" strokeWidth="2">
          <animate attributeName="r" values="15;18;15" dur="1s" repeatCount="indefinite" />
        </circle>
        <text x="40" y="145" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle" fontFamily="Space Mono">L</text>
        <text x="160" y="145" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle" fontFamily="Space Mono">R</text>
        <text x="100" y="160" fill="rgba(57,255,20,0.8)" fontSize="10" textAnchor="middle" fontFamily="Space Mono">Bottom</text>
      </svg>
    </div>
  )
}

function LogicVisual() {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 py-8">
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-cyber-cyan/20 border-2 border-cyber-cyan flex items-center justify-center text-cyber-cyan font-orbitron text-xl md:text-2xl">A</div>
      <div className="text-cyber-cyan text-2xl">→</div>
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-cyber-pink/20 border-2 border-cyber-pink flex items-center justify-center text-cyber-pink font-orbitron text-xl md:text-2xl">B</div>
      <div className="text-cyber-pink text-2xl">→</div>
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-cyber-green/20 border-2 border-cyber-green flex items-center justify-center text-cyber-green font-orbitron text-xl md:text-2xl">C</div>
    </div>
  )
}

function SpatialVisual({ type }: { type: 'cubes' | 'net' }) {
  if (type === 'cubes') {
    return (
      <div className="flex items-center justify-center py-8">
        <svg viewBox="0 0 200 180" className="w-48 md:w-64">
          <defs>
            <linearGradient id="cubeTop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff006e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff006e" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#39ff14" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#39ff14" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Bottom layer - 4 cubes */}
          {[0, 1, 2, 3].map(i => {
            const x = 50 + (i % 2) * 40 + Math.floor(i / 2) * 20
            const y = 120 + Math.floor(i / 2) * 25 - (i % 2) * 25
            return (
              <g key={`bottom-${i}`}>
                <polygon points={`${x},${y} ${x+40},${y-20} ${x+40},${y+10} ${x},${y+30}`} fill="url(#cubeLeft)" stroke="#ff006e" strokeWidth="1" />
                <polygon points={`${x+40},${y-20} ${x+80},${y} ${x+80},${y+30} ${x+40},${y+10}`} fill="url(#cubeRight)" stroke="#39ff14" strokeWidth="1" />
                <polygon points={`${x},${y} ${x+40},${y-20} ${x+80},${y} ${x+40},${y+20}`} fill="url(#cubeTop)" stroke="#00f5ff" strokeWidth="1" />
              </g>
            )
          })}
          {/* Top layer - visible cubes */}
          {[0, 1].map(i => {
            const x = 70 + i * 40
            const y = 70 - i * 25
            return (
              <g key={`top-${i}`}>
                <polygon points={`${x},${y} ${x+40},${y-20} ${x+40},${y+10} ${x},${y+30}`} fill="url(#cubeLeft)" stroke="#ff006e" strokeWidth="1" />
                <polygon points={`${x+40},${y-20} ${x+80},${y} ${x+80},${y+30} ${x+40},${y+10}`} fill="url(#cubeRight)" stroke="#39ff14" strokeWidth="1" />
                <polygon points={`${x},${y} ${x+40},${y-20} ${x+80},${y} ${x+40},${y+20}`} fill="url(#cubeTop)" stroke="#00f5ff" strokeWidth="1" />
              </g>
            )
          })}
        </svg>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center py-8">
      <svg viewBox="0 0 200 160" className="w-48 md:w-64">
        {/* Cube net - cross pattern */}
        <rect x="70" y="10" width="40" height="40" fill="rgba(0,245,255,0.2)" stroke="#00f5ff" strokeWidth="2" />
        <rect x="30" y="50" width="40" height="40" fill="rgba(255,0,110,0.2)" stroke="#ff006e" strokeWidth="2" />
        <rect x="70" y="50" width="40" height="40" fill="rgba(57,255,20,0.2)" stroke="#39ff14" strokeWidth="2" />
        <rect x="110" y="50" width="40" height="40" fill="rgba(191,0,255,0.2)" stroke="#bf00ff" strokeWidth="2" />
        <rect x="150" y="50" width="40" height="40" fill="rgba(255,107,0,0.2)" stroke="#ff6b00" strokeWidth="2" />
        <rect x="70" y="90" width="40" height="40" fill="rgba(0,245,255,0.2)" stroke="#00f5ff" strokeWidth="2" />
        {/* Fold arrows */}
        <path d="M 90 55 L 90 45" stroke="white" strokeWidth="1" opacity="0.5" markerEnd="url(#arrow)" />
      </svg>
    </div>
  )
}

function SequenceVisual({ numbers }: { numbers: (number | string)[] }) {
  return (
    <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 py-8 px-4">
      {numbers.map((num, i) => (
        <div
          key={i}
          className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-lg md:text-2xl font-mono font-bold rounded-lg
            ${num === '?' ? 'bg-cyber-green/20 border-2 border-dashed border-cyber-green text-cyber-green animate-pulse-glow' : 'bg-white/10 text-white/80'}`}
        >
          {num}
        </div>
      ))}
    </div>
  )
}

function ColorPatternVisual() {
  const colors = ['#ff006e', '#00f5ff', '#39ff14', '#ff006e', '#00f5ff']
  return (
    <div className="flex items-center justify-center gap-3 md:gap-4 py-8">
      {colors.map((color, i) => (
        <div
          key={i}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40` }}
        />
      ))}
      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-dashed border-white/50 flex items-center justify-center text-white/50 text-xl">?</div>
    </div>
  )
}

function OddOneOutVisual() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="grid grid-cols-2 gap-4">
        {['2→4→6', '3→6→9', '5→10→12', '7→14→21'].map((seq, i) => (
          <div key={i} className="px-4 py-2 bg-white/5 rounded-lg font-mono text-sm text-white/70 border border-white/10">
            {seq}
          </div>
        ))}
      </div>
    </div>
  )
}

function VennVisual() {
  return (
    <div className="flex items-center justify-center py-8">
      <svg viewBox="0 0 200 140" className="w-56 md:w-72">
        <circle cx="70" cy="70" r="50" fill="rgba(0,245,255,0.15)" stroke="#00f5ff" strokeWidth="2" />
        <circle cx="130" cy="70" r="50" fill="rgba(255,0,110,0.15)" stroke="#ff006e" strokeWidth="2" />
        <text x="45" y="70" fill="#00f5ff" fontSize="10" fontFamily="Space Mono">ANIMALS</text>
        <text x="140" y="70" fill="#ff006e" fontSize="10" fontFamily="Space Mono">PETS</text>
        <text x="100" y="50" fill="#39ff14" fontSize="8" fontFamily="Space Mono" textAnchor="middle">CATS</text>
        <circle cx="100" cy="60" r="15" fill="rgba(57,255,20,0.3)" stroke="#39ff14" strokeWidth="1" />
      </svg>
    </div>
  )
}

// Particle effect component
function Particles({ color, count = 20 }: { color: string; count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            bottom: '40%',
            animation: `particle-float ${1 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.3}s`,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      ))}
    </div>
  )
}

// Challenge Card Component
function ChallengeCard({
  challenge,
  onAnswer,
  isActive,
  answered,
  selectedIndex
}: {
  challenge: Challenge
  onAnswer: (index: number) => void
  isActive: boolean
  answered: boolean
  selectedIndex: number | null
}) {
  const isCorrect = selectedIndex === challenge.correctIndex
  const typeColors: Record<ChallengeType, { bg: string; text: string; glow: string }> = {
    pattern: { bg: 'bg-cyber-cyan/10', text: 'text-cyber-cyan', glow: '#00f5ff' },
    physics: { bg: 'bg-cyber-pink/10', text: 'text-cyber-pink', glow: '#ff006e' },
    logic: { bg: 'bg-cyber-purple/10', text: 'text-cyber-purple', glow: '#bf00ff' },
    spatial: { bg: 'bg-cyber-orange/10', text: 'text-cyber-orange', glow: '#ff6b00' },
    sequence: { bg: 'bg-cyber-green/10', text: 'text-cyber-green', glow: '#39ff14' },
  }

  const typeConfig = typeColors[challenge.type]
  const difficultyColors = {
    easy: 'text-cyber-green',
    medium: 'text-cyber-cyan',
    hard: 'text-cyber-pink'
  }

  return (
    <div className={`snap-item h-screen h-[100dvh] w-full flex flex-col items-center justify-center p-4 md:p-8 relative ${isActive ? 'opacity-100' : 'opacity-50'}`}>
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Particles on correct answer */}
      {answered && isCorrect && <Particles color={typeConfig.glow} count={30} />}

      <div className={`relative w-full max-w-lg card-gradient rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden
        ${answered && isCorrect ? 'animate-success' : ''}
        ${answered && !isCorrect ? 'animate-shake' : ''}`}>
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider ${typeConfig.bg} ${typeConfig.text}`}>
              {challenge.type}
            </span>
            <span className={`text-xs font-mono uppercase ${difficultyColors[challenge.difficulty]}`}>
              {challenge.difficulty}
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-orbitron font-semibold text-white leading-tight">
            {challenge.question}
          </h2>
        </div>

        {/* Visual */}
        <div className="px-4 md:px-6 py-2">
          {challenge.visual}
        </div>

        {/* Options */}
        <div className="p-4 md:p-6 grid grid-cols-2 gap-3">
          {challenge.options.map((option, i) => {
            const isSelected = selectedIndex === i
            const isCorrectOption = i === challenge.correctIndex
            const showCorrect = answered && isCorrectOption
            const showWrong = answered && isSelected && !isCorrectOption

            return (
              <button
                key={i}
                onClick={() => !answered && onAnswer(i)}
                disabled={answered}
                className={`relative py-3 md:py-4 px-4 rounded-xl font-mono text-sm md:text-base transition-all duration-300
                  ${!answered ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white/80 hover:text-white' : ''}
                  ${showCorrect ? 'bg-cyber-green/20 border-2 border-cyber-green text-cyber-green glow-green' : ''}
                  ${showWrong ? 'bg-cyber-pink/20 border-2 border-cyber-pink text-cyber-pink' : ''}
                  ${answered && !showCorrect && !showWrong ? 'bg-white/5 border border-white/5 text-white/30' : ''}
                  disabled:cursor-default`}
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className={`mx-4 md:mx-6 mb-4 md:mb-6 p-4 rounded-xl ${isCorrect ? 'bg-cyber-green/10 border border-cyber-green/30' : 'bg-cyber-pink/10 border border-cyber-pink/30'}`}>
            <p className={`text-sm font-mono ${isCorrect ? 'text-cyber-green/80' : 'text-cyber-pink/80'}`}>
              {isCorrect ? '✓ ' : '✗ '}{challenge.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Scroll hint */}
      {answered && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
          <span className="text-white/30 text-xs font-mono">SCROLL FOR NEXT</span>
          <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </div>
  )
}

// Stats Component
function StatsBar({ streak, correct, total }: { streak: number; correct: number; total: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Streak */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-void/80 backdrop-blur border ${streak > 0 ? 'border-cyber-orange/50' : 'border-white/10'}`}>
            <span className="text-lg">🔥</span>
            <span className={`font-orbitron font-bold ${streak > 0 ? 'text-cyber-orange text-glow-pink' : 'text-white/50'}`}>{streak}</span>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-void/80 backdrop-blur border border-white/10">
          <span className="text-cyber-green font-orbitron font-bold">{correct}</span>
          <span className="text-white/30">/</span>
          <span className="text-white/50 font-mono">{total}</span>
        </div>
      </div>
    </div>
  )
}

// Welcome Screen
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="h-screen h-[100dvh] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyber-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-green animate-pulse-glow">
            BRAIN
          </h1>
          <h1 className="text-5xl md:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink via-cyber-green to-cyber-cyan -mt-2">
            SCROLL
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-white/60 font-mono text-sm md:text-base mb-12 max-w-sm mx-auto">
          Train your mind while you scroll.<br/>
          Logic • Physics • Patterns • Spatial
        </p>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="group relative px-12 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-green rounded-2xl font-orbitron font-bold text-void text-lg
            hover:shadow-[0_0_40px_rgba(0,245,255,0.5)] transition-all duration-300 hover:scale-105"
        >
          <span className="relative z-10">START TRAINING</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-green to-cyber-cyan rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Features */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {['🧠 Logic', '⚛️ Physics', '🔷 Patterns', '📐 Spatial'].map((feature, i) => (
            <span key={i} className="px-4 py-2 bg-white/5 rounded-full text-white/50 text-sm font-mono border border-white/10">
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main App
export default function App() {
  const [started, setStarted] = useState(false)
  const [challenges] = useState<Challenge[]>(generateChallenges)
  const [answers, setAnswers] = useState<Map<number, number>>(new Map())
  const [streak, setStreak] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const correctCount = Array.from(answers.entries()).filter(
    ([id, idx]) => challenges.find(c => c.id === id)?.correctIndex === idx
  ).length

  const handleAnswer = useCallback((challengeId: number, optionIndex: number) => {
    const challenge = challenges.find(c => c.id === challengeId)
    if (!challenge) return

    setAnswers(prev => new Map(prev).set(challengeId, optionIndex))

    if (optionIndex === challenge.correctIndex) {
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }
  }, [challenges])

  // Track active card
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const cardHeight = container.clientHeight
      const index = Math.round(scrollTop / cardHeight)
      setActiveIndex(index)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [started])

  if (!started) {
    return (
      <>
        <div className="scanlines" />
        <WelcomeScreen onStart={() => setStarted(true)} />
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="scanlines" />
      <StatsBar streak={streak} correct={correctCount} total={answers.size} />

      <div ref={containerRef} className="snap-container bg-void">
        {challenges.map((challenge, index) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onAnswer={(idx) => handleAnswer(challenge.id, idx)}
            isActive={index === activeIndex}
            answered={answers.has(challenge.id)}
            selectedIndex={answers.get(challenge.id) ?? null}
          />
        ))}

        {/* End screen */}
        <div className="snap-item h-screen h-[100dvh] flex flex-col items-center justify-center p-8 relative">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="relative text-center">
            <h2 className="text-4xl md:text-5xl font-orbitron font-black text-white mb-4">
              SESSION COMPLETE
            </h2>
            <div className="text-6xl md:text-8xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-green mb-4">
              {Math.round((correctCount / challenges.length) * 100)}%
            </div>
            <p className="text-white/50 font-mono mb-8">
              {correctCount} of {challenges.length} correct
            </p>
            <button
              onClick={() => {
                setAnswers(new Map())
                setStreak(0)
                setActiveIndex(0)
                containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="px-8 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-green rounded-xl font-orbitron font-bold text-void hover:scale-105 transition-transform"
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 pb-2 pointer-events-none">
      <p className="text-center text-white/20 text-[10px] font-mono tracking-wide">
        Requested by @0xPaulius · Built by @clonkbot
      </p>
    </footer>
  )
}