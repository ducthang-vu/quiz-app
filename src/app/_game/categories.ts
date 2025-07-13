import { GAME_CATEGORIES, GameCategory } from '@/lib/open-trivia/types';
import { Option } from '@/app/_game/ui/form-controls/option';

type CategoryName = keyof typeof GAME_CATEGORIES;

type GROUP = 'Science' | 'Entertainment' | 'GENERAL';

type CategoryIdString = `${GameCategory}`;

interface Group {
    items: GameCategoryItem[];
    label: string;
}

class GameCategoryItem implements Option<CategoryIdString> {
    readonly group: GROUP = 'GENERAL';
    readonly value: CategoryIdString;
    readonly label: string;

    constructor(public readonly id: GameCategory) {
        const name: CategoryName = Object.keys(GAME_CATEGORIES).find(key => GAME_CATEGORIES[key as CategoryName] === id) as CategoryName;
        const prefix = name.split('_')[0];
        if (['Science', 'Entertainment'].includes(prefix)) {
            this.group = prefix as GROUP;
        }
        this.value = this.id.toString() as CategoryIdString;
        const baseLabel: string[] = name.split('_');
        const segments: string[] = baseLabel.length > 1 ? baseLabel.slice(1) : baseLabel;
        this.label = segments.join(' ');
    }

}

function sortByGroup(a: { label: string }, b: { label: string }): number {
    return a.label.localeCompare(b.label);
}

const ALL_CATEGORIES = Object.values(GAME_CATEGORIES)
    .map(id => new GameCategoryItem(id))
    .filter(i => i.id !== GAME_CATEGORIES.Any_Category)
    .toSorted((a, b) => a.label.localeCompare(b.label));

const science: Group = {
    label: 'Science',
    items: ALL_CATEGORIES.filter(i => i.group === 'Science')
}

const entertainment: Group = {
    label: 'Entertainment',
    items: ALL_CATEGORIES.filter(i => i.group === 'Entertainment')
}

const general: Group = {
    label: 'GENERAL',
    items: ALL_CATEGORIES.filter(i => i.group === 'GENERAL')
}

/**
 * All categories available adapted to {@link Option interface}. Option related to "Science" and "Entertainment" are
 * grouped together. "Any Category" option is not in the list. The list in alphabetical order.
 */
export const CATEGORIES: (Group | Option<CategoryIdString>)[] = [
    ...general.items,
    entertainment,
    science
].toSorted(sortByGroup);
