module.exports = function(sequelize, DataTypes) {
    var Group = sequelize.define('Group', {
        handle      : { type: DataTypes.STRING, unique: true },
    }, {
        classMethods: { 
            associate: function(models) {
                Group.belongsToMany(models.User, { through: 'UserGroup' });
            }
        }
    });

    return Group;
};
