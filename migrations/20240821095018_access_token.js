const { table } = require("console");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable("access_token", (table) => {
        table.string("id");
        table.integer("user_id").references("id").inTable("users").unsigned().onDelete("cascade");
        table.boolean("revoked").defaultTo(false);
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
        table.timestamp("expiresAt");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTable("access_token");
};
