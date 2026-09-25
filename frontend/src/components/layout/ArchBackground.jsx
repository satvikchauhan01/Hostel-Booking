import { FloorPlanArt } from './FloorPlanArt';

/** Fixed, very low contrast backdrop: soft light, a dotted coordinate grid and (optionally) a faint floor plan. */
export function ArchBackground({ plan = true }) {
  return (
    <div className="arch-bg" aria-hidden="true">
      <div className="arch-bg__light" />
      <div className="arch-bg__dots" />
      {plan && (
        <div className="arch-bg__plan">
          <FloorPlanArt filled={[2, 5, 6, 13, 16, 18]} labelled={false} />
        </div>
      )}
    </div>
  );
}
