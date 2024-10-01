import { useState } from 'react'

const roundToDecimal = (num, dec) => {
  const decimals = Math.pow(10, dec)
  return Math.round(num*decimals)/decimals
};

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad;
  const average = all > 0 ? roundToDecimal((good - bad) / all, 1) : undefined;
  const positive = all > 0 ? roundToDecimal((good / all) * 100, 1) : undefined;
  console.log(all)
  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    );
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive + " %"} />
      </tbody>
    </table>
  );
};


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App