const link_To_Service = './../services/';

const craeteFilterStatus = async (currentStatus, collection) => {
    const main_Service = require(link_To_Service + collection + '_Service');

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

const createPaginationItems = async (filter, currentPage, collection) => {
    const main_Service = require(link_To_Service + collection + '_Service');

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