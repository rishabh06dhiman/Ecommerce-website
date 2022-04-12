class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options: "i"
            },
        } : {};
        this.query = this.query.find({ ...keyword });
        return this; 
    }
    filter(){
        const querycopy = {...this.queryStr}

        // remove some field for category
        const removeField = ["keyword","page","limit"];
        removeField.forEach(key=>delete querycopy[key]);

        // filter for price and rating
        let queryStr = JSON.stringify(querycopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`$${key}`); 
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = currentPage * (currentPage-1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
};
module.exports = ApiFeatures;