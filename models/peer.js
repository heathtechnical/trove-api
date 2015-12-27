module.exports = function(sequelize, DataTypes) {
    var Peer = sequelize.define('Peer', {
        id              : { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
	handle          : { type: DataTypes.STRING, unique: true },
        host            : { type: DataTypes.STRING },
        type            : { type: DataTypes.ENUM('AGENT', 'APISERVICE') },
        heartbeat       : { type: DataTypes.DATE },
        disabled        : { type: DataTypes.BOOLEAN }
    }, {
        classMethods: {
            associate: function(models){
                Peer.hasMany(models.Path);
            }
        }
    });

    return Peer;
};
