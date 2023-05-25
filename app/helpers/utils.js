const Item = require('./../schemas/items');

let craeteFilterStatus = async (currentStatus) => {
    //console.log("createFilterStatus");
    let statusFilter = [
        { name: 'All', count: 0, link: '#', class: 'success' },
        { name: 'Active', count: 0, link: '#', class: 'default' },
        { name: 'InActive', count: 0, link: '#', class: 'default' }
    ];

    await (updateCounts = async () => {
        for (let i = 0; i < statusFilter.length; i++) {
            if (statusFilter[i].name.toLowerCase() === currentStatus) statusFilter[i].class = 'success';
            else statusFilter[i].class = 'default'

            let count = 0;
            if (statusFilter[i].name.toLowerCase() === 'all') {
                count = await Item.count({});
            } else {
                count = await Item.count({ status: statusFilter[i].name.toLowerCase() });
            }
            statusFilter[i].count = count;
        }
    })();

    return statusFilter;
}

module.exports = {
    craeteFilterStatus: craeteFilterStatus
}