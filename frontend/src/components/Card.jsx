import Icon from './Icon.jsx'
import { tone } from '../lib/tone.js'

export default function Card({ title, sub, right, children, className = '', style, icon, iconColor }) {
  return (
    <div className={'card ' + className} style={style}>
      {(title || right) && (
        <div className="card-h">
          {icon && (
            <span className="habit-ico" style={{ width: 32, height: 32, background: `color-mix(in srgb, ${tone(iconColor)} 16%, transparent)`, color: tone(iconColor) }}>
              <Icon name={icon} size={17} />
            </span>
          )}
          <div>
            {title && <h2>{title}</h2>}
            {sub && <div className="sub">{sub}</div>}
          </div>
          {right && <div className="spacer" style={{ marginLeft: 'auto' }}>{right}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
