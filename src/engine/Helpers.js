/**
 * Helpers for checking descendants, ancestors, spouses, and sibling patterns in the active heirs object.
 * An active heir must be present and not blocked.
 */

export function hasDescendants(heirs) {
    return ['SON', 'DAUGHTER', 'GRANDSON', 'GRANDDAUGHTER', 'GREAT_GRANDSON', 'GREAT_GRANDDAUGHTER'].some(
        r => heirs[r] && !heirs[r].is_blocked
    );
}

export function hasMaleDescendants(heirs) {
    return ['SON', 'GRANDSON', 'GREAT_GRANDSON'].some(
        r => heirs[r] && !heirs[r].is_blocked
    );
}

export function hasFemaleDescendants(heirs) {
    return ['DAUGHTER', 'GRANDDAUGHTER', 'GREAT_GRANDDAUGHTER'].some(
        r => heirs[r] && !heirs[r].is_blocked
    );
}

export function hasSon(heirs) {
    return !!(heirs['SON'] && !heirs['SON'].is_blocked);
}

export function hasGrandson(heirs) {
    return !!(heirs['GRANDSON'] && !heirs['GRANDSON'].is_blocked);
}

export function hasFather(heirs) {
    return !!(heirs['FATHER'] && !heirs['FATHER'].is_blocked);
}

export function hasGrandfather(heirs) {
    return ['PATERNAL_GRANDFATHER', 'PATERNAL_GREAT_GRANDFATHER'].some(
        r => heirs[r] && !heirs[r].is_blocked
    );
}

export function hasSpouse(heirs) {
    return ['HUSBAND', 'WIFE'].some(
        r => heirs[r] && !heirs[r].is_blocked
    );
}

export function getActiveSiblingsCount(heirs) {
    let count = 0;
    const siblingKeys = ['FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'MATERNAL_BROTHER', 'MATERNAL_SISTER'];
    for (const key of siblingKeys) {
        if (heirs[key] && !heirs[key].is_blocked) {
            count += heirs[key].count;
        }
    }
    return count;
}

export function hasMultipleSiblings(heirs) {
    return getActiveSiblingsCount(heirs) > 1;
}
