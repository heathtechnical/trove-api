module.exports = function(sequelize, DataTypes) {
    var PathMetric = sequelize.define('PathMetric', {
	name            : { type    :   DataTypes.STRING },
	value           : { type    :   DataTypes.FLOAT }
    }, {
        classMethods: {
            associate: function(models){
                PathMetric.belongsTo(models.Path);
            },
            intervalSeries: function(start, interval){
                //var sql = "with filled_dates as ( select day, 0 as blank_count from generate_series('2015-12-27 00:00'::timestamptz, " +
                var sql = "with filled_dates as ( select day, 0 as blank_count from generate_series(:start, " +
                          "current_timestamp::timestamptz, :interval_t) as day ), signup_counts as ( select name, date_trunc(:interval, \"createdAt\") " +
                          "as day, avg(value) as signups from \"PathMetrics\" group by name,date_trunc(:interval, \"createdAt\") ) "+
                          "select name, filled_dates.day, coalesce(signup_counts.signups, filled_dates.blank_count) as signups from filled_dates " +
                          "left outer join signup_counts on signup_counts.day = filled_dates.day order by filled_dates.day";

                return this.sequelize.query(sql, { replacements: { start: new Date('01/12/2015'), interval_t: '1 day', interval: 'day' } });
            }
        }
    });

    return PathMetric;
};
