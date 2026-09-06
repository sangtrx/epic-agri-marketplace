export function OfferLot({ metadata, stock, compact = false }: {
 metadata?: Record<string, unknown> | null; stock?: number; compact?: boolean;
}) {
 if (!metadata?.demo) return null;
 const pack = Number(metadata.pack_kg) || 1;
 return <div className={compact ? "epic-lot epic-lot-compact" : "epic-lot"} data-testid="offer-lot">
  <p><strong>{String(metadata.province)}</strong> · {String(metadata.supply_region)}</p>
  <p>{String(metadata.grade)}</p>
  <div className="epic-lot-facts"><span>{pack} kg / pack</span><span>{String(metadata.lead_time_days)} day lead time</span></div>
  {!compact && <><p>{String(metadata.availability_window)}</p><p>{stock ?? 0} packs available · {(stock ?? 0) * pack} kg · minimum 1 pack</p><small>Seller-declared demo lot · not quality inspected</small></>}
 </div>;
}
