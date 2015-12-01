module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username   : { type: DataTypes.STRING, unique: true, allowNull: false },
	password   : { type: DataTypes.STRING },
        last_seen: { type: DataTypes.DATE },
        disabled : { type: DataTypes.BOOLEAN }
    }, {
        classMethods: {
            associate: function(models) {
                User.belongsToMany(models.Group, { through: 'UserGroup' });
            }
        }
    });

    return User;
};
