/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("email", 255).unique().notNullable();
        table.string("password").notNullable();
        table.string("countryCode").notNullable();
        table.bigint("phoneNo").unique().notNullable();
        table.string("otp").nullable();
        table.timestamp("otpVerifiedAt").nullable()
        table.timestamp("otpExpiredAt").nullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt");
        table.string("rememberToken").nullable();
        table.timestamp("rememberTokenExpiredAt").nullable();

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTable("users");
};
