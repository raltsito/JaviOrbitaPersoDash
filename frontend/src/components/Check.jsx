import Icon from './Icon.jsx'

export default function Check({ on, onClick, size = 24 }) {
  return (
    <div className={'checkbox' + (on ? ' on' : '')} onClick={onClick} style={{ width: size, height: size }} role="checkbox" aria-checked={on}>
      <Icon name="check" size={size * 0.62} color="#fff" />
    </div>
  )
}
