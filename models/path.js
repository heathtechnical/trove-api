module.exports = function(sequelize, DataTypes) {
    var Path = sequelize.define('Path', {
	source          : { type: DataTypes.STRING },
        disabled        : { type: DataTypes.BOOLEAN }
    }, {
        classMethods: {
            associate: function(models){
                Path.belongsToMany(models.Peer, { through: "PeerPath" });
            }
        }
    });

    return Path;
};
