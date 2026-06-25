import { motion } from 'framer-motion'
import WeatherMetrics from './WeatherMetrics.jsx'
import DecisionCard from './DecisionCard.jsx'
import RiskBreakdownCard from './RiskBreakdownCard.jsx'
import BestTimeCard from './BestTimeCard.jsx'
import SafetyWarningsCard from './SafetyWarningsCard.jsx'
import GearChecklist from './GearChecklist.jsx'
import AlternativeSuggestions from './AlternativeSuggestions.jsx'
import HourlyTimelineChart from './HourlyTimelineChart.jsx'
import FollowUpInput from './FollowUpInput.jsx'

export default function ResultDashboard({ result, context, onFollowUpResult }) {
  if (!result) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <WeatherMetrics weatherSummary={result.weather_summary} />

      <div className="mx-auto mt-6 grid max-w-6xl gap-4 px-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DecisionCard result={result} />
        </div>
        <div className="space-y-4">
          <BestTimeCard bestTime={result.best_time} bestDay={result.best_day} />
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-6xl px-4">
        <HourlyTimelineChart
          timeline={result.hourly_timeline}
          timeframe={result.best_day ? '7-day hourly view' : '24-hour forecast'}
        />
      </div>

      <div className="mx-auto mt-4 grid max-w-6xl gap-4 px-4 lg:grid-cols-2">
        <RiskBreakdownCard breakdown={result.risk_breakdown} />
        <div className="space-y-4">
          <SafetyWarningsCard warnings={result.safety_warnings} />
          <GearChecklist gear={result.recommended_gear} />
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-6xl px-4">
        <AlternativeSuggestions alternatives={result.alternative_suggestions} />
      </div>

      <FollowUpInput context={context} onResult={onFollowUpResult} />
    </motion.div>
  )
}
