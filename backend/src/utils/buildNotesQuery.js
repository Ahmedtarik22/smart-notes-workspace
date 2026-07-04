function buildNotesQueryOptions(userId, queryParams = {}) {
  const {
    search = '',
    category = '',
    status = '',
    sort = '',
    page = '1',
    limit = '10',
  } = queryParams;

  const query = { userId };

  if (search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { content: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  if (category.trim()) {
    query.category = category.trim();
  }

  if (status.trim()) {
    query.status = status.trim();
  }

  let sortOptions = { isPinned: -1, createdAt: -1 };

  if (sort) {
    const isDesc = sort.startsWith('-');
    const field = isDesc ? sort.slice(1) : sort;
    sortOptions = { [field]: isDesc ? -1 : 1 };
  }

  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
  const skipNumber = (pageNumber - 1) * limitNumber;

  return {
    query,
    sortOptions,
    pageNumber,
    limitNumber,
    skipNumber,
  };
}

module.exports = buildNotesQueryOptions;
