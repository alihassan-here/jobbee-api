class APIFilters {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        //REMOVING FIELDS FROM THE QUERY
        const removeFields = ["sort", "fields", "q", "limit", "page"];
        removeFields.forEach(el => delete queryCopy[el]);

        //ADVANCE FILTER USING: lt, lte, gt, gte
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            //IF THERE ARE MULTIPLE CONDITIONS FOR SORTING
            const sortBy = this.queryStr.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            //IF NO VALUE IS PROVIDED FOR SORTING BY USER THEN SORT JOBS BY POSTING DATE BY DEFAULT
            this.query = this.query.sort("-postingDate");
        }
        return this;
    }
    //GETTING SPECIFIC FIELDS
    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v")
        }
        return this;
    }
    //SEARCH BY QUERY
    searchByQuery() {
        if (this.queryStr.q) {
            const qu = this.queryStr.q.split("-").join(" ");
            this.query = this.query.find({ $text: { $search: "\"" + qu + "\"" } });
        } else {

        }
        return this;
    }
    //PAGINATION
    pagination() {
        //BASE 10
        const page = parseInt(this.queryStr.page, 10) || 1;
        const limit = parseInt(this.queryStr.limit, 10) || 10;
        const skipResults = (page - 1) * limit;
        this.query = this.query.skip(skipResults).limit(limit);
        return this;
    }
}

module.exports = APIFilters;