module.exports = function(sequelize, DataTypes) {
    var PathMetric = sequelize.define('PathMetric', {
	name            : { type    :   DataTypes.STRING },
	value           : { type    :   DataTypes.FLOAT }
    }, {
        classMethods: {
            associate: function(models){
                PathMetric.belongsTo(models.Path);
                //generate_series('2015-01-01 00:00'::timestamptz, current_date::timestamptz, '1 day')
            },
            intervalSeries: function(name, start, end, interval){
                var sql = "with filled_dates as ( select day, 0 as blank_count from generate_series(:start::timestamptz, " +
                          ":end::timestamptz, :interval_t) as day ), signup_counts as ( select name, date_trunc(:interval, \"createdAt\") " +
                          "as day, avg(value) as signups from \"PathMetrics\" group by name,date_trunc(:interval, \"createdAt\") ) "+
                          "select name, filled_dates.day, coalesce(signup_counts.signups, filled_dates.blank_count) as signups from filled_dates " +
                          "left outer join signup_counts on signup_counts.day = filled_dates.day order by filled_dates.day";

                var replacements = {
                    start      : start || new Date('01/01/2015'),
                    end        : end || new Date(),
                    interval   : interval || 'day'
                };

                replacements.interval_t = '1 ' + replacements.interval;

                console.log(replacements);

                return this.sequelize.query(sql, { replacements: replacements });
            }
        }
    });

    return PathMetric;
};
