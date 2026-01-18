function fmtDate(d) {
  return d ? new Date(d).toLocaleString("sv-SE") : "—";
}

function getLat(sp) {
  return sp?.latitude ?? sp?.coordinates?.latitude ?? "—";
}
function getLng(sp) {
  return sp?.longitude ?? sp?.coordinates?.longitude ?? "—";
}

export default function TripDetailModal({ open, trip, onClose }) {
  if (!open || !trip) return null;

  const sp = trip?.startPosition || {};
  const ep = trip?.endPosition || {};

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <strong>Resdetaljer</strong>
          <button type="button" className="btn" onClick={onClose}>
            Stäng
          </button>
        </div>

        <div className="modal-body">
          <p><strong>ID:</strong> {trip?.id ?? trip?._id ?? "—"}</p>
          <p><strong>Scooter:</strong> {trip?.scooter ?? "—"}</p>
          <p><strong>Start:</strong> {fmtDate(trip?.startTime)}</p>
          <p><strong>Slut:</strong> {fmtDate(trip?.endTime)}</p>
          <p><strong>Tid:</strong> {trip?.duration ?? "—"}</p>
          <p><strong>Kostnad:</strong> {trip?.cost ?? "—"}</p>

          <hr />

          <p><strong>Startplats:</strong> {sp?.city ?? "—"}</p>
          <p><strong>Start (lat,long):</strong> {getLat(sp)}, {getLng(sp)}</p>

          <p><strong>Slutplats:</strong> {ep?.city ?? "—"}</p>
          <p><strong>Slut (lat,long):</strong> {getLat(ep)}, {getLng(ep)}</p>

          {Array.isArray(trip?._parkingTags) && trip._parkingTags.length > 0 && (
            <>
              <hr />
              <p><strong>Parkering / avgifter:</strong></p>
              <p style={{ opacity: 0.9 }}>{trip._parkingTags.join(" • ")}</p>
              <p><strong>Bas:</strong> {trip._baseCost} kr</p>
              <p><strong>Justering:</strong> {trip._adjustment} kr</p>
              <p><strong>Totalt:</strong> {trip._adjustedCost} kr</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
