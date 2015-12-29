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
                var sql = "with filled_dates as ( select day, 0 as blank_count from generate_series(:start::timestamptz, " +
                          ":end::timestamptz, :interval_t) as day ), metric_counts as ( select name, date_trunc(:interval, \"createdAt\") " +
                          "as day, avg(value) as metric from \"PathMetrics\" group by name,date_trunc(:interval, \"createdAt\") ) "+
                          "select metric_counts.name, filled_dates.day, coalesce(metric_counts.metric, filled_dates.blank_count) as metric from filled_dates " +
                          "left outer join metric_counts on metric_counts.day = filled_dates.day order by filled_dates.day";

                params.start = params.start || new Date().strtotime('-1 week');
                params.end = params.end || new Date().strtotime('-1 second');
                params.interval = params.interval || 'day';
                params.interval_t = '1 ' + params.interval;

                return this.sequelize.query(sql, { replacements: params });
            }
        }
    });

    return PathMetric;
};
