import CriteriaAmounts from './CriteriaAmounts.js';
import CriteriaItems from './CriteriaItems.js';
import CriteriaProducts from './CriteriaProducts.js';
import CriteriaProductCategories from './CriteriaProductCategories.js';
import CriteriaUsers from './CriteriaUsers.js';
import CriteriaUserRoles from './CriteriaUserRoles.js';
import CriteriaPeriods from './CriteriaPeriods.js';

var _criteria = new Map([
    ['amounts', CriteriaAmounts],
    ['items', CriteriaItems],
    ['periods', CriteriaPeriods],
    ['products', CriteriaProducts],
    ['product_categories', CriteriaProductCategories],
    ['users', CriteriaUsers],
    ['user_roles', CriteriaUserRoles],
    ['default', CriteriaAmounts],
    // ['countries', CriteriaItems],
]);

export default class CriteriaFactory {

    static create(id, criteria, conditions = {}) {
        if (!_criteria.has(criteria)) {
            criteria = 'default';
        }
        return new (_criteria.get(criteria))(id, conditions);
    }

    static createAndScrollTo(id, criteria, conditions = {}) {
        conditions.scrollTo = true;
        return this.create(id, criteria, conditions);
    }

    static createFrom(existingCriteria, newType) {
        if (!_criteria.has(newType)) {
            newType = 'default';
        }
        return new(_criteria.get(newType))(existingCriteria.id(), existingCriteria.conditions(), existingCriteria);
    }

}