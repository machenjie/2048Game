const Sequelize = require("sequelize");

module.exports = {
    sequelize: null,
    Feedback: null,
    isReady: false,
    async init(s){
        if (this.sequelize === null) {
            this.sequelize = s;
            this.Feedback = this.sequelize.define("feedback", {
                email: {
                    type: Sequelize.STRING,
                },
                comment: {
                    type: Sequelize.STRING,
                },
                srcIP: {
                    type: Sequelize.STRING,
                },
            });
        }
        await this.Feedback.sync();
        this.isReady = true;
      },
    async addOne(obj){
        return this.Feedback.create({
            email: obj.email,
            comment: obj.comment,
            srcIP: obj.srcIP,
        });
    },
    async addMany(objList){
        return this.Feedback.bulkCreate(objList);
    },
};

