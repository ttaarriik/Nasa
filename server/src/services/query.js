const LIMIT_DEFAULT = 0;
const PAGE_DEFAULT = 1;

const getPagination = (query) => {
    const page = Math.abs(query.page) || PAGE_DEFAULT;
    const limit = Math.abs(query.limit) || LIMIT_DEFAULT;

    const skip = (page - 1) * limit;

    return  {
        skip,
        limit
    }
}

module.exports = {
    getPagination
}