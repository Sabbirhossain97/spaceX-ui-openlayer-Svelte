export function calculateSuccessRate(landpad) {
    const { successful_landings, attempted_landings } = landpad;
    if (!attempted_landings || attempted_landings === 0) {
        return 0;
    }
    return (
        Math.round((successful_landings / attempted_landings) * 100)
    );
}
