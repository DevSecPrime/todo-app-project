const { table } = require("console");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable("refresh_token", (table) => {
        table.string("id", 191), primary();
        table
            .string("accessTokenId")
            .references("id")
            .inTable("access_token")
            .unsigned()
            .onDelete("CASCADE")
        table.boolean("revoked").defaultTo(false);
        table.timestamp("expresAt")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTable("refresh_token");
};
