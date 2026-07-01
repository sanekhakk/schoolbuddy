export default function AdSlot({ position = 'banner', className = '' }) {
  const sizes = {
    banner: 'h-24',
    sidebar: 'h-64',
    inContent: 'h-28',
    footer: 'h-20'
  }
  return (
    <div
      className={`${sizes[position] || sizes.banner} ${className} w-full rounded-xl border-2 border-dashed border-navy-100 dark:border-navy-700 flex items-center justify-center text-xs text-navy-400 dark:text-navy-100`}
    >
      Advertisement
    </div>
  )
}
