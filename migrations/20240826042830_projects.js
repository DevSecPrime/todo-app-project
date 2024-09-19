/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable("projects", (table) => {
        table.increments("id").primary();
        table.integer("userId")
            .references("id")
            .inTable("users")
            .unsigned()
            .onDelete("CASCADE");
        table.string("groupId")
            .references("id")
            .inTable("groups")
            .unsigned()
            .onDelete("CASCADE");
        table.string("projectName").notNullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTable("projects");
};
