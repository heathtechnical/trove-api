module.exports = function(sequelize, DataTypes) {
    var Path = sequelize.define('Path', {
	source          : { type: DataTypes.STRING },
        last_update     : { type: DataTypes.DATE }
    });

    return Path;
};
