class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        const queries = { ...this.queryString }
        const excludeFields = ['page', 'limit', 'sort', 'fields']
        excludeFields.forEach(field => delete queries[field])

        const queryStr = JSON.parse(
            JSON.stringify(queries)
                .replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        )

        this.mongooseQuery = this.mongooseQuery.find(queryStr)
        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.sort(sortBy)
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
        }
        return this
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.select(fields)
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v')
        }
        return this
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let query = {}
            if (modelName === 'Products') {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } },
                ];

            } else {
                query = {
                    name: { $regex: this.queryString.keyword, $options: 'i' }
                }
            }
            this.mongooseQuery = this.mongooseQuery.find(query)
        }
        return this
    }

    paginate(totalDocuments) {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 5;
        const skip = (page - 1) * limit
        const endIndex = page * limit

        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)

        const pagination = {}
        pagination.page = page
        pagination.limit = limit
        pagination.numberOfPages = Math.ceil(totalDocuments / limit)

        if (endIndex < totalDocuments) {
            pagination.nextPage = page + 1
        }
        if (skip > 0) {
            pagination.prevPage = page - 1
        }
        this.paginationResult = pagination
        return this
    }

    populate(payload) {
        this.mongooseQuery = this.mongooseQuery.populate(payload)
        return this
    }
}
module.exports = ApiFeatures;