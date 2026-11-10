import { Fragment } from 'react'

const DOMAIN = 'firma-ta.erp.andaxi.ro'

/** Textul cu adresa instanței ținută pe un singur rând (altfel se rupe la
 *  cratima din „firma-ta”). */
const NoWrapDomain = ({ text }: { text: string }) => {
  const parts = text.split(DOMAIN)
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="whitespace-nowrap">{DOMAIN}</span>}
        </Fragment>
      ))}
    </>
  )
}

export default NoWrapDomain
