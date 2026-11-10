interface MarqueeProps {
  items: string[]
}

/** Infinite horizontal scrolling strip. Content is duplicated so the CSS
 *  animation can loop seamlessly at -50%. */
const Marquee = ({ items }: MarqueeProps) => {
  const row = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {items.map((item, i) => (
        <span
          key={i}
          className="mx-3 flex items-center gap-3 whitespace-nowrap rounded-full border border-[color:var(--border)] px-5 py-2.5 text-sm text-[color:var(--text-3)]"
        >
          {item}
        </span>
      ))}
    </div>
  )

  return (
    <div className="relative flex overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

export default Marquee
