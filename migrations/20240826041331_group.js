/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable("groups", (table) => {
        table.increments("id").primary();
        table.integer("userId")
            .references("id")
            .inTable("users")
            .unsigned()
            .onDelete("CASCADE");
        table.string("groupName").notNullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTable("groups");
};
