module.exports = function(sequelize, DataTypes) {
    var Path = sequelize.define('Path', {
        id              : { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
	source          : {
            type:       DataTypes.STRING,
            unique:     'uniqueSource'
        },
        disabled        : { type: DataTypes.BOOLEAN }
    }, {
        classMethods: {
            associate: function(models){
                Path.belongsTo(models.Peer, { 
                    foreignKey: {
                        name:   'PeerId',
                        unique: 'uniqueSource'
                    }
                });
            }
        }
    });

    return Path;
};
