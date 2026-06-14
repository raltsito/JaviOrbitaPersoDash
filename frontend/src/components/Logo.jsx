import logo from '../assets/logo.png'

export default function Logo({ size = 38 }) {
  return (
    <img
      src={logo}
      alt="Órbita"
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px color-mix(in srgb, var(--accent) 30%, transparent))' }}
    />
  )
}
