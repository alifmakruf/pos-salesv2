import React from 'react'
export default function ProductArt({ tone = 'sand', large = false }) {
  return <div className={`product-art art-${tone} ${large ? 'art-large' : ''}`} aria-hidden="true">
    <div className="art-shadow" />
    <div className="furniture">
      {tone === 'slate' ? <><div className="chair-back"/><div className="chair-seat"/><div className="chair-leg l1"/><div className="chair-leg l2"/><div className="chair-leg l3"/><div className="chair-leg l4"/></> : tone === 'cream' ? <><div className="sofa-back"/><div className="sofa-seat"/><div className="sofa-arm a1"/><div className="sofa-arm a2"/><div className="sofa-foot f1"/><div className="sofa-foot f2"/></> : tone === 'wood' ? <><div className="cabinet"/><div className="cabinet-door d1"/><div className="cabinet-door d2"/><div className="cabinet-handle h1"/><div className="cabinet-handle h2"/></> : tone === 'oak' ? <><div className="shelf-top"/><div className="shelf-side"/><div className="shelf-level one"/><div className="shelf-level two"/><div className="shelf-level three"/><div className="shelf-leg sl1"/><div className="shelf-leg sl2"/></> : <><div className="table-top"/><div className="table-leg tl1"/><div className="table-leg tl2"/><div className="table-leg tl3"/><div className="table-leg tl4"/></>}
    </div>
  </div>
}
