const main_Service = require('./../services/groups_Service');
const craeteFilterStatus = async (currentStatus) => {
    let statusFilter = [
        { name: 'all', count: 0, class: 'btn-success' },
        { name: 'active', count: 0, class: 'btn-default' },
        { name: 'Inactive', count: 0, class: 'btn-default' }
    ];

    if (currentStatus && currentStatus !== 'all') {
        statusFilter.map((status) => (status.name.toLowerCase() === currentStatus) ? status.class = 'btn-success' : status.class = 'btn-default');
    }

    for (const status of statusFilter) {
        status.count = await main_Service.countItemsByStatus(status.name.toLowerCase());
    }

    return statusFilter;
}

const createPaginationItems = async (filter, currentPage) => {
    let pagination = {
        totalItems: 1,
        totalPages: 1,
        limit: 3,
        currentPage: currentPage,
        pageRanges: 5,
        offset: 0
    };
    pagination.offset = (pagination.currentPage - 1) * pagination.limit;
    pagination.totalItems = await main_Service.countItems(filter);
    pagination.totalPages = Math.ceil(pagination.totalItems / pagination.limit);

    return pagination;
}

module.exports = {
    craeteFilterStatus: craeteFilterStatus,
    createPaginationItems: createPaginationItems
}