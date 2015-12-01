module.exports = function(sequelize, DataTypes) {
    var Peer = sequelize.define('Peer', {
	handle          : { type: DataTypes.STRING, unique: true },
        type            : { type: DataTypes.ENUM('AGENT', 'APISERVICE') },
        heartbeat       : { type: DataTypes.DATE },
        disabled        : { type: DataTypes.BOOLEAN }
    });

    return Peer;
};
