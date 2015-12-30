var util = require('util');
require('date-util');

module.exports = function(sequelize, DataTypes) {
    var PathMetric = sequelize.define('PathMetric', {
	name            : { type    :   DataTypes.STRING },
	value           : { type    :   DataTypes.FLOAT }
    }, {
        classMethods: {
            associate: function(models){
                PathMetric.belongsTo(models.Path);
            },
            intervalSeries: function(params) {
                var sql = "WITH filled AS (%s), " + 
                    "metrics AS (SELECT name, date_trunc(:interval, \"createdAt\") AS time, avg(value) AS metric, count(value) AS metric_count FROM \"PathMetrics\" GROUP BY name, date_trunc(:interval, \"createdAt\") )" + 
                    "SELECT filled.name, filled.time, coalesce(metrics.metric, filled.metric) AS metric, metrics.metric_count AS metric_count FROM filled "+
                    "LEFT OUTER JOIN metrics ON metrics.name = filled.name AND metrics.time = filled.time ORDER BY filled.time";

                var sql_union = "SELECT %s::text AS name, time, 0 AS metric FROM generate_series(date_trunc(:interval, :start::timestamptz), :end::timestamptz, :interval_t) AS time";

                var sql_unions = [];
                for (var i = 0, len = params.names.length; i < len; i++) {
                    sql_unions.push(util.format(sql_union, ":metric_name" + i));
                    params["metric_name" + i] = params.names[i];
                }
                sql = util.format(sql, sql_unions.join(" UNION "));

                params.start = params.start || new Date().strtotime('-1 week');
                params.end = params.end || new Date().strtotime('-1 second');
                params.interval = params.interval || 'time';
                params.interval_t = '1 ' + params.interval;

                console.log({ sql: sql, params: params });

                return this.sequelize.query(sql, { replacements: params });
            }
        }
    });

    return PathMetric;
};
