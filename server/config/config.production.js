exports.PORT = process.env.PORT || 80;
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/toptal_caltracker";

// Since this setting is very sensitive, we will not set any default value and force the developers to set it from
// an environment variable.
exports.TOKEN_SIGN_SECRET = process.env.TOKEN_SIGN_SECRET;